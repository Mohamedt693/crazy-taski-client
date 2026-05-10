import { useEffect } from "react";
import { useParams } from "react-router-dom";

// FullCalendar Imports
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// components
import UpdateEventForm from "../../../components/forms/events/UpdateEventForm";
import AddEventForm from "../../../components/forms/events/AddEventForm";
import AddButton from "../../../components/ui/buttons/AddButton";
import Loader from "../../../components/ui/Loader";

// stores
import { useEventStore } from "../../../store/useEventStore";
import { useProjectStore } from "../../../store/useProjectStore";
import { useSidebarStore } from "../../../store/useSidebarStore";
import { UpdateProjectForm } from "../../../components/forms/projects/UpdateProjectForm";

// types
import type { DateSelectArg } from '@fullcalendar/core';

function Events() {
  const { id } = useParams(); 
  const { events, getProjectEvents, isLoading } = useEventStore();
  const { setContent } = useSidebarStore();
  const { getProjectById } = useProjectStore();
  const currentProject = getProjectById(id!);

  useEffect(() => {
    if (id) {
      getProjectEvents(id);
      setContent(<UpdateProjectForm projectId={id} />);
    }
  }, [id, getProjectEvents, setContent]);

  const projectEvents = id ? events[id] || [] : [];
  
  const calendarEvents = projectEvents.map(event => ({
    id: event._id,
    title: event.title,
    start: event.start,
    end: event.end,
    extendedProps: { ...event } 
  }));

  const handleEventClick = (info : { event: { id: string } }) => {
    setContent(<UpdateEventForm projectId={id!} eventId={info.event.id} />);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setContent(
      <AddEventForm 
        key={selectInfo.startStr}
        projectId={id!} 
        initialStart={selectInfo.startStr} 
        initialEnd={selectInfo.endStr}
      />
    );

    // عشان نشيل التحديد الأزرق بعد ما الفورم يفتح
    // selectInfo.view.calendar.unselect();
  };

  return (
    <div className="flex-1 min-h-screen p-8 overflow-y-auto custom-scrollbar">
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl text-(--primary-text) font-black tracking-tight">
              {currentProject?.name ? `${currentProject.name} Schedule` : "Project Schedule"}
            </h1>
            <p className="text-slate-400 font-medium mt-2">
              Manage your daily timeline and meetings.
            </p>
          </div>

          <AddButton 
          projectId={id!}
          buttonType="event"
          />
        </div>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek" 
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridDay,timeGridWeek,dayGridMonth'
              }}
              events={calendarEvents}
              eventClick={handleEventClick}
              editable={false}   
              selectable={true}
              select={handleDateSelect}
              selectMirror={true}
              height="auto"
              slotMinTime="00:00:00" 
              slotMaxTime="24:00:00" 
              eventColor="#3b82f6"   
              allDaySlot={false} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;