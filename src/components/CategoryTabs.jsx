import React from "react";
import { CategoryBar, CategoryInner, CategoryTab } from "./CategoryTabs.styles";

export default function CategoryTabs({ tabs, activeId, onChange }) {
  return (
    <CategoryBar>
      <CategoryInner>
        {tabs.map((tab) => (
          <CategoryTab
            key={tab.id}
            $active={tab.id === activeId}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </CategoryTab>
        ))}
      </CategoryInner>
    </CategoryBar>
  );
}
