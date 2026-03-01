"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DataFieldCard } from "@/components/control-plane/DataFieldCard";
import { useControlPlaneStore } from "@/store/controlPlane";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
    { id: 1, title: "Overview", description: "Current phase & status" },
    { id: 2, title: "Case ID", description: "Platform generated case ID" },
    { id: 3, title: "Ops Channel", description: "Comms bridge" },
    { id: 4, title: "Owner", description: "Confirm case assignment" },
    { id: 5, title: "Permissions", description: "Mint proofs" },
    { id: 6, title: "Documents", description: "KYB & Attachments" },
    { id: 7, title: "Signals", description: "Push to Identity/Payments surfaces" },
];

export function OnboardingWizard() {
    const onboardingStatus = useControlPlaneStore((state) => state.onboardingStatus);
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(1);

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setDirection(1);
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setDirection(-1);
            setCurrentStep(currentStep - 1);
        }
    };

    const slideVariants = {
        initial: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            filter: "blur(4px)",
        }),
        animate: {
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: { type: "spring" as const, stiffness: 400, damping: 40, staggerChildren: 0.1, delayChildren: 0.1 },
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -50 : 50,
            opacity: 0,
            filter: "blur(4px)",
            transition: { type: "spring" as const, stiffness: 400, damping: 40 },
        }),
    };

    const itemVariants = {
        initial: { y: 10, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 40 } },
    };

    return (
        <div className="w-full space-y-12">
            {/* Stepper (Minimal 7-steps) */}
            <div className="relative mx-auto max-w-2xl px-4 md:px-0">
                <div className="absolute left-0 top-2.5 h-[2px] w-full -translate-y-1/2 bg-border/40"></div>
                <div
                    className="absolute left-0 top-2.5 h-[2px] -translate-y-1/2 bg-foreground transition-all duration-700 ease-out"
                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                />

                <div className="relative flex justify-between">
                    {STEPS.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isCurrent = currentStep === step.id;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-4">
                                <div
                                    className={cn(
                                        "relative flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-bold transition-all duration-500",
                                        isCompleted ? "border-foreground bg-foreground text-background scale-90" :
                                            isCurrent ? "border-foreground border-[2px] text-foreground ring-4 ring-background scale-110" :
                                                "border-muted-foreground/30 border text-muted-foreground scale-90"
                                    )}
                                >
                                    {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.id}
                                </div>
                                {/* Only show title for current step to prevent 7-column clutter */}
                                <div className={cn("hidden sm:block absolute top-8 whitespace-nowrap transition-all duration-300",
                                    isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none")}>
                                    <div className="text-xs font-semibold tracking-wide text-foreground px-3 py-1 bg-muted rounded-md shadow-sm border border-border/50">{step.title}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Container (No Border/Card style) */}
            <div className="relative min-h-[300px] w-full max-w-2xl mx-auto overflow-visible px-4 md:px-0 mt-16">
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full"
                    >
                        <div className="py-2">
                            {currentStep === 1 && (
                                <div className="space-y-8 max-w-lg mx-auto md:mx-0">
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <h2 className="text-xl font-medium tracking-tight">Phase Overview</h2>
                                        <p className="text-sm text-muted-foreground">Review the current phase of the merchant onboarding process.</p>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="space-y-4">
                                        <div className="rounded-xl border border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 md:p-8">
                                            <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Current Phase</p>
                                            <p className="text-3xl font-semibold tracking-tight text-foreground">
                                                {onboardingStatus}
                                            </p>
                                        </div>
                                        <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-lg">
                                            Update this copy when handing off to another operator. If a status is unknown, paste your
                                            best guess and mark it as needing confirmation.
                                        </p>
                                    </motion.div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-8 max-w-lg mx-auto md:mx-0">
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <h2 className="text-xl font-medium tracking-tight">System Identity</h2>
                                        <p className="text-sm text-muted-foreground">Configure the core identifier for this onboarding.</p>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <DataFieldCard
                                            title="Onboarding case ID"
                                            description="Generated when access is requested."
                                            field="onboardingCaseId"
                                            placeholder="case_ops_478"
                                            className="border-border/40 shadow-none hover:border-border transition-colors h-full"
                                        />
                                    </motion.div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-8 max-w-lg mx-auto md:mx-0">
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <h2 className="text-xl font-medium tracking-tight">Operational Comms</h2>
                                        <p className="text-sm text-muted-foreground">Link the central communication bridge.</p>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <DataFieldCard
                                            title="Ops channel link"
                                            description="Slack bridge or Telegram channel."
                                            field="onboardingOpsChannel"
                                            placeholder="https://t.me/+atlas-ops"
                                            className="border-border/40 shadow-none hover:border-border transition-colors h-full"
                                        />
                                    </motion.div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-8 max-w-lg mx-auto md:mx-0">
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <h2 className="text-xl font-medium tracking-tight">Confirm Assigment</h2>
                                        <p className="text-sm text-muted-foreground">First validation step of the onboarding checklist.</p>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="flex gap-4 p-5 rounded-xl border border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20">
                                        <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                                            <div className="h-5 w-5 rounded border border-border/80 flex items-center justify-center bg-background shadow-sm" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-foreground">Confirm Onboarding case has owner assigned</p>
                                            <p className="text-xs text-muted-foreground">Check the internal tracker to ensure an operator claims this merchant.</p>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className="space-y-8 max-w-lg mx-auto md:mx-0">
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <h2 className="text-xl font-medium tracking-tight">Verify Minting</h2>
                                        <p className="text-sm text-muted-foreground">Second validation step of the onboarding checklist.</p>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="flex gap-4 p-5 rounded-xl border border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20">
                                        <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                                            <div className="h-5 w-5 rounded border border-border/80 flex items-center justify-center bg-background shadow-sm" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-foreground">Verify activation agent can mint Hello GOAT proofs</p>
                                            <p className="text-xs text-muted-foreground">The assigned agent needs correct smart contract permissions.</p>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {currentStep === 6 && (
                                <div className="space-y-8 max-w-lg mx-auto md:mx-0">
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <h2 className="text-xl font-medium tracking-tight">Compliance Docs</h2>
                                        <p className="text-sm text-muted-foreground">Third validation step of the onboarding checklist.</p>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="flex gap-4 p-5 rounded-xl border border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20">
                                        <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                                            <div className="h-5 w-5 rounded border border-border/80 flex items-center justify-center bg-background shadow-sm" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-foreground">Collect compliance attachments</p>
                                            <p className="text-xs text-muted-foreground">Gather all required passports, KYB forms, and origin documents.</p>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {currentStep === 7 && (
                                <div className="space-y-8 max-w-lg mx-auto md:mx-0">
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <h2 className="text-xl font-medium tracking-tight">System Push</h2>
                                        <p className="text-sm text-muted-foreground">Final validation step of the onboarding checklist.</p>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="space-y-4">
                                        <div className="flex gap-4 p-5 rounded-xl border border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20">
                                            <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                                                <div className="h-5 w-5 rounded border border-border/80 flex items-center justify-center bg-background shadow-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-foreground">Push signals to Identity and Payments surfaces</p>
                                                <p className="text-xs text-muted-foreground">Sync the completed onboarding payload across the network once ready.</p>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <div className="flex gap-3 text-xs text-muted-foreground">
                                                <div className="h-full w-0.5 bg-amber-500/50 flex-shrink-0" />
                                                <p className="max-w-md text-amber-700 dark:text-amber-400/90 font-medium">Requires human confirmation — persist each identifier after verifying the source of truth.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation (Minimal) */}
            <div className="flex items-center justify-between pt-4 max-w-2xl mx-auto border-t border-border/40 px-4 md:px-0">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={cn("gap-2 text-muted-foreground hover:text-foreground -ml-4", currentStep === 1 && "opacity-0")}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    variant="ghost"
                    className="gap-2 font-medium bg-foreground text-background hover:bg-foreground/90 hover:text-background -mr-4 rounded-full px-6"
                >
                    {currentStep === STEPS.length ? "Finish" : "Continue"}
                    {currentStep !== STEPS.length && <ChevronRight className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}
