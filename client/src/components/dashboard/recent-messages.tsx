import { messageTypesLabels } from "@/config/labels";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { RecentMessage } from "@/types/dashboard";

interface RecentMessagesProps{
    messages: RecentMessage[];
    className?: string;
}

export function RecentMessages({ messages, className }: RecentMessagesProps) {
    return (
        <section className={cn("rounded-xl border bg-card p-5", className)}>
            <h2 className="text-sm font-medium">Recent activity</h2>

            {messages.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                    No messages yet. Messages you generate will show up here.
                </p>
            ) : (
                    <ul className="mt-4 divide-y">
                        {messages.map((message) => (
                            <li key={message._id} className="py-3 first:pt-0 last:pb-0">
                                <div className="flex items-start justify-between gap-3">
                                    <p className="min-w-0 truncate text-sm font-medium">
                                        {message.contact ? message.contact.name : "Deleted contact"}
                                        {message.contact?.company && (
                                            <span className="font-normal text-muted-foreground">
                                                {" "}
                                                · {message.contact.company}
                                            </span>
                                        )}
                                    </p>
                                    <time dateTime={message.createdAt}
                                    className="shrink-0 text-xs text-muted-foreground"
                                    >
                                        {formatRelativeTime(message.createdAt)}
                                    </time>
                                </div>

                                <div className="mt-1.5 flex items-center gap-2">
                                    <span className=" rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">
                                        {messageTypesLabels[message.type] ?? message.type}
                                    </span>

                                    {message.variantLabel && (
                                        <span className="rounded-md bg-accent px-1.5 py-0.5 text-xs font-medium text-accent-foreground">
                                            Variant {message.variantLabel}
                                        </span>
                                    )}
                                </div>

                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                    {message.subject ? `${message.subject} - ` : ""}
                                    {message.content}
                                </p>
                            </li>
                        ))}
                    </ul>
            )}
        </section>
    )
}