# 🎓 Course Dashboard

## 📝 1. Overview of CRUD Operations

- **Create:** User submits SAT score, major, and message via form → data is saved locally.
- **Read:** Submitted entries are displayed in a table below the form.
- **Update:** User can edit a submission, update the form, and resave it.
- **Delete:** User can remove a submission from the list via a delete button.

> ✅ All operations reflect immediately on the web page using `localStorage` or in-memory lists.

---

## 🗂 2. Data Model (ERD Diagram)

![data-model](https://github.com/user-attachments/assets/107ff249-88cd-4b68-9109-9c30717ce7f7)

## 🔧 3. Notable Technical Challenges and Solutions

### ✅ 1. Dropdown Not Loading Majors
- **Challenge:** Dropdown menu showed “Loading…” or failed to populate.  
- **Solution:** Ensure proper data fetching using API calls on page load or via async methods.

### ✅ 2. Data Not Persisting After Refresh
- **Challenge:** Submitted entries vanished upon page refresh.  
- **Solution:** Implement `localStorage`, `sessionStorage`, or save entries to a backend database.

### ✅ 3. Invalid SAT Score or Empty Fields
- **Challenge:** Users submitted invalid (e.g., non-numeric) or empty data.  
- **Solution:** Add client-side and server-side validation for input fields.

### ✅ 4. Update Not Reflecting in UI
- **Challenge:** Changes weren’t shown immediately after edits.  
- **Solution:** Refresh or rebind the data list after each update.

### ✅ 5. Wrong Entry Deleted
- **Challenge:** Clicking delete affected the incorrect row.  
- **Solution:** Use unique identifiers (e.g., `SubmissionID`) to accurately target entries.

### ✅ 6. Data Duplication on Submission
- **Challenge:** Submitting the form multiple times caused duplicate entries.  
- **Solution:** Disable the submit button until the request completes or implement duplicate-check logic.

### ✅ 7. Missing Timestamp on Entries
- **Challenge:** No information on when entries were added.  
- **Solution:** Add a `DateAdded` field with the current timestamp on submission.

### ✅ 8. Integration with Advisor Emails
- **Challenge:** Advisor contact details didn’t update with selected major.  
- **Solution:** Map `MajorID` to advisor data and populate dynamically.

---
