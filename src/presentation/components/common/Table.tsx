import { type JSX, type ParentComponent } from 'solid-js';

export const TableContainer: ParentComponent = (props) => {
    return (
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {props.children}
        </div>
    );
};

interface FilterBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    statusOptions?: { label: string; value: string }[];
    statusValue?: string;
    onStatusChange?: (value: string) => void;
    onExport?: (type: string) => void;
}

export const FilterBar = (props: FilterBarProps) => {
    return (
        <div class="p-4 border-b border-slate-200 flex gap-4 items-center">
            <input
                type="text"
                placeholder={props.searchPlaceholder || "Search..."}
                class="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                value={props.searchValue}
                onInput={(e) => props.onSearchChange(e.currentTarget.value)}
            />
            {props.statusOptions && (
                <select
                    class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                    value={props.statusValue || ''}
                    onInput={(e) => props.onStatusChange?.(e.currentTarget.value)}
                >
                    <option value="">All Status</option>
                    {props.statusOptions.map(opt => (
                        <option value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            )}

            {/* Export Buttons */}
            {props.onExport && (
                <div class="flex gap-2">
                    <button
                        onClick={() => props.onExport?.('copy')}
                        class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Copy"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                    </button>
                    <button
                        onClick={() => props.onExport?.('csv')}
                        class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="CSV"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                            <path d="M16 13H8" />
                            <path d="M16 17H8" />
                            <path d="M10 9H8" />
                        </svg>
                    </button>
                    <button
                        onClick={() => props.onExport?.('download')}
                        class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Download"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                    </button>
                    <button
                        onClick={() => props.onExport?.('print')}
                        class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Print"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9V2h12v7" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <path d="M6 14h12v8H6z" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export const DataTable: ParentComponent = (props) => {
    return (
        <div class="overflow-x-auto">
            <table class="w-full">
                {props.children}
            </table>
        </div>
    );
};

export const TableHeader: ParentComponent = (props) => {
    return (
        <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
                {props.children}
            </tr>
        </thead>
    );
};

interface TableHeadProps {
    className?: string;
    sortable?: boolean;
    children: JSX.Element;
}

export const TableHead = (props: TableHeadProps) => {
    return (
        <th class={`px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${props.className || ''}`}>
            {props.children}
        </th>
    );
};

export const TableBody: ParentComponent = (props) => {
    return (
        <tbody class="divide-y divide-slate-200">
            {props.children}
        </tbody>
    );
};

export const TableRow: ParentComponent<{ className?: string }> = (props) => {
    return (
        <tr class={`hover:bg-slate-50 transition-colors ${props.className || ''}`}>
            {props.children}
        </tr>
    );
};

export const TableCell: ParentComponent<{ className?: string }> = (props) => {
    return (
        <td class={`px-4 py-3 ${props.className || ''}`}>
            {props.children}
        </td>
    );
};

interface ActionButtonProps {
    type: 'view' | 'edit' | 'delete' | 'upload' | 'approve' | 'reject' | 'download';
    label?: string;
    onClick: () => void;
}

export const ActionButton = (props: ActionButtonProps) => {
    const getIcon = () => {
        switch (props.type) {
            case 'view':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                );
            case 'edit':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                );
            case 'delete':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                );
            case 'upload':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                );
            case 'approve':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                );
            case 'reject':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                );
            case 'download':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                );
        }
    };

    const getColorClass = () => {
        switch (props.type) {
            case 'view':
                return 'text-slate-400 hover:text-blue-600 hover:bg-blue-50';
            case 'edit':
                return 'text-slate-400 hover:text-amber-600 hover:bg-amber-50';
            case 'delete':
            case 'reject':
                return 'text-slate-400 hover:text-red-600 hover:bg-red-50';
            case 'upload':
            case 'download':
                return 'text-slate-400 hover:text-blue-600 hover:bg-blue-50';
            case 'approve':
                return 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50';
        }
    };

    return (
        <button
            onClick={props.onClick}
            class={`p-2 rounded-lg transition-all ${getColorClass()}`}
            title={props.label || props.type}
        >
            {getIcon()}
            {props.label && <span class="ml-1 text-xs">{props.label}</span>}
        </button>
    );
};

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export const Pagination = (props: PaginationProps) => {
    return (
        <div class="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
            <p class="text-sm text-slate-600">
                Showing {((props.currentPage - 1) * props.itemsPerPage) + 1} to {Math.min(props.currentPage * props.itemsPerPage, props.totalItems)} of {props.totalItems} items
            </p>
            <div class="flex gap-2">
                <button
                    onClick={() => props.onPageChange(Math.max(1, props.currentPage - 1))}
                    disabled={props.currentPage === 1}
                    class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span class="px-3 py-1 text-sm font-medium text-slate-700">
                    Page {props.currentPage} of {props.totalPages}
                </span>
                <button
                    onClick={() => props.onPageChange(Math.min(props.totalPages, props.currentPage + 1))}
                    disabled={props.currentPage === props.totalPages}
                    class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

interface EmptyStateProps {
    message: string;
    subMessage?: string;
    onReset?: () => void;
}

export const EmptyState = (props: EmptyStateProps) => {
    return (
        <div class="py-8 text-center">
            <p class="text-slate-500">{props.message}</p>
            {props.subMessage && <p class="text-sm text-slate-400 mt-1">{props.subMessage}</p>}
            {props.onReset && (
                <button
                    onClick={props.onReset}
                    class="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Reset filters
                </button>
            )}
        </div>
    );
};
