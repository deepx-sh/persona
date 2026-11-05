import { Check } from "lucide-react";
import { Logo } from "@/components/brand/logo";

const highlights = [
    "Personalized from real profile context, not merge tags",
    "LinkedIn notes, cold emails and follow-ups in one flow",
    "Four tones, four languages, and A/B/C variants"
]

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col px-6 py-8 sm:px-12">
                <Logo />
                
                <div className="flex flex-1 items-center justify-center py-12">
                    <div className="w-full max-w-sm">{children}</div>
                </div>
            </div>

            <aside className="hidden flex-col justify-center gap-10 border-l bg-muted px-16 py-12 lg:flex">
                <div className="space-y-5">
                    <h2 className="max-w-md text-3xl font-semibold tracking-tight text-balance">
                        Outreach that reads like you did your homework
                    </h2>

                    <ul className="space-y-3">
                        {highlights.map((item) => (
                            <li key={item} className="flex items-start gpa-3 text-sm text-muted-foreground">
                                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <figure className="max-w-md rounded-xl border bg-background p-5 shadow-xs">
                    <figcaption className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Sample LinkedIn note
                    </figcaption>
                    <blockquote className="text-sm leading-relaxed">
                        Hi Deep, I noticed you&apos;re working at Google as a Software Engineer focused on distributed systems. I&apos;d love to connect and swap on building at that scale.
                    </blockquote>
                </figure>
            </aside>
        </div>
    )
}