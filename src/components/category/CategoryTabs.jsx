import React from "react";
import { CategoryBar, CategoryInner, CategoryTab } from "./CategoryTabs.styles";

export default function CategoryTabs({ tabs, activeId, onChange }) {
  return (
    <CategoryBar>
      <CategoryInner>
        {tabs.map(function (tab) {
          return (
            <CategoryTab
              key={tab.id}
              $active={tab.id === activeId}
              onClick={function () {
                return onChange(tab.id);
              }}
            >
              {tab.label}
            </CategoryTab>
          );
        })}
      </CategoryInner>
    </CategoryBar>
  );
}
