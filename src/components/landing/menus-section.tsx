"use client"

import { MenuCard, type MenuItem } from "./menu-card"
import { motion, Variants } from "framer-motion"

const coffees: MenuItem[] = [
  {
    id: "americano",
    title: "Americano",
    description: "Made from one shot of good quality espresso and 5 oz hot water.",
    price: "Rp. 8,000.00",
    imageQuery: "coffee cherries close up",
  },
  {
    id: "cappuccino-1",
    title: "Cappuccino",
    description: "Smooth espresso with silky milk foam.",
    price: "Rp. 8,000.00",
    imageQuery: "cappuccino cup top view",
  },
  {
    id: "cappuccino-2",
    title: "Cappuccino",
    description: "Balanced, creamy and aromatic.",
    price: "Rp. 8,000.00",
    imageQuery: "barista pouring latte art",
  },
  {
    id: "cappuccino-3",
    title: "Cappuccino",
    description: "Classic Italian-style with bold notes.",
    price: "Rp. 8,000.00",
    imageQuery: "coffee beans background",
  },
  {
    id: "cappuccino-4",
    title: "Cappuccino",
    description: "Velvety texture, rich espresso finish.",
    price: "Rp. 8,000.00",
    imageQuery: "coffee machine espresso shot",
  },
  {
    id: "cappuccino-5",
    title: "Cappuccino",
    description: "Perfect for an afternoon pick-me-up.",
    price: "Rp. 8,000.00",
    imageQuery: "coffee close up foam",
  },
]

const nonCoffees: MenuItem[] = [
  {
    id: "lemon-tea",
    title: "Lemon Tea",
    description: "Refreshing and zesty citrus tea.",
    price: "Rp. 8,000.00",
    imageQuery: "iced lemon tea in glass",
  },
]

const container = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}
const item : Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 16 } },
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
          <h3 className="text-xl font-semibold">Coffees</h3>
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
          <h3 className="text-xl font-semibold">Non-Coffees</h3>
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
