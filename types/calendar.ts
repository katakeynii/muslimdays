export interface Event {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    isActive?: boolean;
    date?: string;
}

export interface DayEvents {
    date: string;
    events: Event[];
}

export interface CalendarViewProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
    isExpanded: boolean;
    onToggleExpanded: () => void;
}

export interface EventListProps {
    events: Event[];
} 