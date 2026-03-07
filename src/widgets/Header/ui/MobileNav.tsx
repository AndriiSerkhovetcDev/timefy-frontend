import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BurgerIcon, XIcon } from "@/shared/ui";
import { NavItem } from "./NavItem";
import { modileNavBtns, navItems } from "../model/constans";

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(80);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = document.getElementById("header");

    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideButton = !buttonRef.current?.contains(event.target as Node);
      const isOutsideDropdown = !dropdownRef.current?.contains(event.target as Node);

      if (isOutsideButton && isOutsideDropdown) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="md:hidden flex items-center" ref={buttonRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 hover:text-primary focus:outline-none"
        >
          {isOpen ? <XIcon /> : <BurgerIcon />}
        </button>
      </div>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed bg-white border-t z-40 left-0 border-gray-100 w-full shadow-lg"
              style={{ top: headerHeight }}
              ref={dropdownRef}
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navItems.map((item) => (
                  <NavItem key={item.id} {...item} />
                ))}
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col space-y-3 px-3">
                  {modileNavBtns.map((item) => (
                    <NavItem key={item.id} {...item} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

export default MobileNav;
