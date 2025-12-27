/*
Flow 1: The Breakdown
1. Request: Any user can create a request.
2. Auto-Fill Logic: When the user selects an Equipment (e.g., "Printer 01"):
    -> auto-fetch the Equipment category and Maintenance Team 
        from the equipment record and fill them into the request.

3. Request state: The request starts in the New stage.
4. Assignment: A manager or technician assigns themselves to the ticket.
    -> 
5. Execution: The stage moves to In Progress.
6. Completion: The technician records the Hours Spent (Duration) and moves the stage
to Repaired.

any user-> request:


Flow 2: The Routine Checkup
1. Scheduling: A manager creates a request with the type Preventive.
2. Date Setting: The user sets a Scheduled Date (e.g., Next Monday).
3. Visibility: This request must appear on the Calendar View on the specific date so the
technician knows they have a job to do.

*/