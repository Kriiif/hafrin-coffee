"use client"

import { MenuCard, type MenuItem } from "./menu-card"
import { motion, type Variants } from "framer-motion"

const coffees: MenuItem[] = [
  {
    id: "americano",
    title: "Americano",
    description: "Made from one shot of good quality espresso and 5 oz hot water.",
    price: "Rp. 8,000.00",
    imageQuery: "coffee1",
  },
  {
    id: "cappuccino-1",
    title: "Cappuccino",
    description: "Smooth espresso with silky milk foam.",
    price: "Rp. 8,000.00",
    imageQuery: "coffee1",
  },
  {
    id: "butterscotch",
    title: "Butterscotch",
    description: "Balanced, creamy and aromatic.",
    price: "Rp. 8,000.00",
    imageQuery: "coffee1",
  },
  {
    id: "aren-latte",
    title: "Aren Latte",
    description: "Classic Italian-style with bold notes.",
    price: "Rp. 8,000.00",
    imageQuery: "coffee1",
  },
  {
    id: "moccacino",
    title: "Moccacino",
    description: "Velvety texture, rich espresso finish.",
    price: "Rp. 8,000.00",
    imageQuery: "coffee1",
  },
  {
    id: "latte",
    title: "Latte",
    description: "Perfect for an afternoon pick-me-up.",
    price: "Rp. 8,000.00",
    imageQuery: "coffee1",
  },
]

const nonCoffees: MenuItem[] = [
  {
    id: "chocolate",
    title: "Chocolate",
    description: "With silky milk foam.",
    price: "Rp. 8,000.00",
    imageQuery: "coffee1",
  },
]

const container = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 12 } },
}

export function MenusSection() {
  return (
    <section id="menus" className="py-16">
      <div className="mx-auto max-w-6xl px-4 space-y-10">
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        >
          <h2 className="text-2xl font-semibold">Our Menus</h2>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          >
            <h3 className="text-xl font-semibold">Coffees</h3>
          </motion.div>
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {coffees.map((itemData) => (
              <motion.div key={itemData.id} variants={item}>
                <MenuCard item={itemData} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          >
            <h3 className="text-xl font-semibold">Non-Coffees</h3>
          </motion.div>
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {nonCoffees.map((itemData) => (
              <motion.div key={itemData.id} variants={item}>
                <MenuCard item={itemData} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}