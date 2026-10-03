import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (url: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className="py-3 px-1 text-xs text-stone-400 font-medium"
      itemScope 
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex items-center flex-wrap gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li 
              key={item.url} 
              className="flex items-center gap-1.5"
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {index === 0 ? (
                <button
                  type="button"
                  onClick={() => onNavigate(item.url)}
                  className="flex items-center gap-1 hover:text-amber-400 transition-colors cursor-pointer"
                  itemProp="item"
                >
                  <Home className="w-3.5 h-3.5 text-stone-400" />
                  <span itemProp="name">{item.name}</span>
                </button>
              ) : isLast ? (
                <span 
                  className="text-amber-400 font-semibold truncate max-w-[200px] sm:max-w-none"
                  aria-current="page"
                  itemProp="name"
                >
                  {item.name}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate(item.url)}
                  className="hover:text-amber-400 transition-colors cursor-pointer truncate max-w-[150px] sm:max-w-none"
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </button>
              )}

              <meta itemProp="position" content={String(index + 1)} />

              {!isLast && (
                <ChevronRight className="w-3 h-3 text-stone-600 shrink-0" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
