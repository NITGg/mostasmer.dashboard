export interface Category {
    id: string;
    name: string;
    imageUrl: string;
  }
  
  export interface TableProps {
    data: Category[];
    currentPage: number;
    itemsPerPage: number;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onView?: (id: string) => void;
  }
  
  export interface ActionIconsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
    className?: string;
  }