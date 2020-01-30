import * as React from 'react';

interface BreadcrumbItem {
  id: string;
  label: React.ReactNode;
  url: string;
}

export const BreadcrumbsProvider: React.FC = () => null;

export const useBreadcrumb = (breadcrumb: Omit<BreadcrumbItem, 'id'>) =>
  breadcrumb;

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  return [];
};
