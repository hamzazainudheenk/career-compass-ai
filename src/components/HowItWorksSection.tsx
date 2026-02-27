import { motion } from "framer-motion";
import { Upload, FileSearch, CheckCircle } from "lucide-react";

export const HowItWorksSection = () => {
    const steps = [
        {
            icon: Upload,
            title: "1. Upload Resume ",
            description: "Upload the candidate's PDF resume directly to our secure platform. We extract all text locally for maximum privacy."
        },
        {
            icon: FileSearch,
            title: "2. Paste Job Description",
            description: "Paste the role's requirements. Our AI instantly validates it to ensure accurate matching and evaluation."
        },
        {
            icon: CheckCircle,
            title: "3. Get Instant Insights",
            description: "Receive a detailed HR dashboard with culture fit, technical probing areas, red flags, and tailored interview questions."
        }
    ];

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Evaluate candidates faster with AI-powered insights tailored for recruiters and hiring managers.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="glass rounded-2xl p-8 relative"
                        >
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                <step.icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>

                            {/* Connector line for desktop */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-border/50 translate-y-[-50%]" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
