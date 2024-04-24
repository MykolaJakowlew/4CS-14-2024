import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { message } from 'telegraf/filters';
import { InjectModel } from "@nestjs/mongoose";
import { Links, TelegramContext, TelegramContextArg, UrlTypes, Users } from "models";
import { Model } from "mongoose";

let bot: Telegraf<Context<Update>> | null = null;

@Injectable()
export class TelegramService {
    constructor(
        @InjectModel(Users.name)
        private Users: Model<Users>,
        @InjectModel(Links.name)
        private Links: Model<Links>,
        private configService: ConfigService
    ) {
        const telegramToken = this.configService.getOrThrow('telegram.token')
        const domain = this.configService.getOrThrow('publicUrl')

        if (!bot) {
            bot = new Telegraf(telegramToken)

            bot.launch({
                webhook: {
                    domain,
                    path: '/telegram'
                }
            })

            this.init()
        }
    }

    private init() {
        bot.on(message('text'), async (context: TelegramContextArg, next) => {
            const { from: { first_name, id, last_name, username } } = context

            const user = await this.Users.findOne({
                telegramId: id
            })

            if (!user) {
                const doc = new this.Users({
                    firstName: first_name,
                    lastName: last_name,
                    telegramId: id,
                    userName: username,
                    links: []
                })

                const user = await doc.save();
                context.user = user.toObject()
            } else {
                context.user = user.toObject()
            }

            return next()
        })

        bot.on(message('text'), async (ctx: TelegramContextArg, next) => {
            const { message: { text } } = ctx

            try {
                const type = this.getLinkType(text)

                if (type === UrlTypes.OTHER) {
                    ctx.reply('We do not found type of this link. We will use standart logic')
                }

                let link = await this.Links.findOne({
                    url: text
                })

                if (!link) {
                    const doc = new this.Links({
                        url: text,
                        receivedAt: new Date(),
                        type,
                    })

                    link = await doc.save();

                }

                const { user } = ctx
                await this.Users.findOneAndUpdate(
                    { _id: user._id },
                    {
                        $addToSet: {
                            links: link._id
                        }
                    }
                )
                ctx.reply('Link was added')
            } catch (err) {
                return ctx.reply(err.toString())
            }

        })
    }

    get bot(): Telegraf<Context<Update>> {
        return bot;
    }


    getLinkType(link: string) {
        if (!/^https?:\/\//.test(link)) {
            throw new Error(`Link has wrong format`)
        }

        if (/amazon/.test(link)) {
            return UrlTypes.AMAZON
        }

        return UrlTypes.OTHER
    }
}
