# TODO: Implement Select Event Dropdown in DA Module

## Tasks
- [x] Update API response format in app/api/events/route.ts to match { success, data, message }
- [x] Update Event interface in app/(protected)/da/page.tsx to include all fields
- [x] Add eventsError state in DaPage component
- [x] Update useEffect to handle new API response, error handling, and auto-select first event
- [x] Update Select component to display error state
- [x] Test loading, empty, and error states
- [x] Verify selectedEventId is passed to child components
