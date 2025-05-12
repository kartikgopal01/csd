import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Menu = ({ children, setActive }) => {
  return (
    <nav className="relative rounded-full border border-white/20 bg-white/10 shadow-lg backdrop-blur-md">
      <ul className="flex items-center justify-center gap-2 px-8 py-2">
        {children}
      </ul>
    </nav>
  );
};

export const MenuItem = ({ setActive, active, item, children, href }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (active === item) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [active, item]);

  return (
    <li ref={ref} className="relative flex items-center justify-center">
      <div
        className="px-4 py-2 text-white cursor-pointer"
        onMouseEnter={() => setActive(item)}
        onMouseLeave={() => setActive(null)}
      >
        <span className="text-sm font-medium">{item}</span>
        {active === item && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20 -z-10"
            layoutId="active"
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
            }}
          ></motion.div>
        )}
      </div>
      {active === item && (
        <div
          onMouseEnter={() => setActive(item)}
          onMouseLeave={() => setActive(null)}
          className="absolute left-0 top-full pt-4 w-64"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-xl"
          >
            {children}
          </motion.div>
        </div>
      )}
    </li>
  );
};

export const HoveredLink = ({ children, href, className }) => {
  return (
    <Link
      to={href}
      className={`block rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-all duration-200 ${className}`}
    >
      {children}
    </Link>
  );
};

export const ProductItem = ({ title, description, href, src }) => {
  return (
    <Link to={href} className="flex gap-4 rounded-lg p-2 hover:bg-white/20 transition-all duration-200">
      <div className="h-12 w-12 overflow-hidden rounded-lg">
        <img
          src={src}
          alt={title}
          width={50}
          height={50}
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <p className="text-xs text-white/70">{description}</p>
      </div>
    </Link>
  );
}; 