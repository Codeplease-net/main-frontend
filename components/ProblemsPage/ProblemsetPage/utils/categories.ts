import { useTranslations } from "next-intl";
import { Category } from "../types/interfaces";

// Replace the existing categories definition
export function categories(): Category[] {
    const t = useTranslations("Topics");
    return [
      // Basic Algorithms
      { code: "brute-force", name: t("Brute Force") },
      { code: "binary-search", name: t("Binary Search") },
      { code: "greedy", name: t("Greedy") },
  
      // Fundamental Topics
      { code: "string", name: t("String") },
      { code: "search", name: t("Search") },
      { code: "sort", name: t("Sort") },
  
      // Core CS Topics
      { code: "number-theory", name: t("Number Theory") },
      { code: "ds", name: t("Data Structure") },
      { code: "dp", name: t("Dynamic Programming") },
      { code: "graph", name: t("Graph") },
      { code: "tree", name: t("Tree") },
  
      // Intermediate Techniques
      { code: "2-pointers", name: t("Two Pointers") },
      { code: "bit", name: t("Bit Manipulation") },
      { code: "geometry", name: t("Geometry") },
      { code: "games", name: t("Games") },
      { code: "combinatorics", name: t("Combinatorics") },
  
      // Advanced Topics
      { code: "meet-in-the-middle", name: t("Meet In The Middle") },
      { code: "probabilities", name: t("Probabilities") },
      { code: "crt", name: t("Chinese Remainder Theorem") },
      { code: "fft", name: t("Fast Fourier Transform") },
      { code: "graph-matchings", name: t("Graph Matchings") },
      { code: "interactive", name: t("Interactive") },
      { code: "matrix", name: t("Matrix") },
      { code: "ternary-search", name: t("Ternary Search") },
    ].sort((a, b) => a.name.localeCompare(b.name));
  }