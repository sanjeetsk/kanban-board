# Kanban Board Application

## Overview
This project is a Kanban Board application that replicates the given design. It includes functionality for managing tasks within different sections.

## Features

- **Predefined Sections**: The board starts with three sections:  
  - 📝 **Todo**  
  - 🛧 **In Progress**  
  - ✅ **Done**  

- **Add Sections**: Users can add more sections using the `+ Add Section` button.

- **Task Management**:
  - Users can add tasks to sections using the `+` button next to the section title or the **Add Task** button (if no tasks exist in the section).
  - Each task includes:
    - 📌 **Task Name**
    - 📝 **Description**
    - 📅 **Due Date**
    - 👤 **Assignee** (User)

- **Drag & Drop**: Users can update the task status by dragging a task card from one section to another.

- **Task Deletion**: Users can delete a task using the **More** button (three dots on the top right corner of the task) and selecting **Delete**.

## Technologies Used
- **Frontend**: React (with state management)
- **Backend**: Node.js, Express.js (for API handling)
- **Database**: MongoDB (for storing users and tasks)
- **Authentication**: JWT (for user authentication)
