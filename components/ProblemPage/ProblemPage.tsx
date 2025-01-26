"use client"
import ProblemSetTable from "@/components/ProblemPage/ProblemTable"
import React, { Suspense } from "react"
import Footer from '@/components/footer';
import { motion } from "framer-motion";
import DotsLoader from "@/components/PlaygroundPage/DotsLoader";

export default function ProblemsPage({ searchParams }: {
    searchParams: { [key: string]: string | undefined }
}) {
    const currentPage = Number(searchParams.page) || 1;
    const category = searchParams.category || '';

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/50"
        >
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-600">
                        Problem Collection
                    </h1>
                    <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                        Enhance your programming skills with our carefully curated collection of problems
                    </p>
                </motion.div>

                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                        <DotsLoader size={12} />
                        <p className="text-muted-foreground animate-pulse">Loading problems...</p>
                    </div>
                }>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="rounded-lg backdrop-blur-sm"
                    >
                        <ProblemSetTable currentPage={currentPage} category={category} />
                    </motion.div>
                </Suspense>
            </main>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Footer />
            </motion.div>
        </motion.div>
    )
}