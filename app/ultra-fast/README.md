# Ultra-Fast Mode

This directory contains a simplified, parallel workflow for ORION called "Ultra-Fast Mode".

## Objective

Provide a simple, functional, and isolated workflow for generating videos from a spreadsheet, focusing on practical success and fast execution.

## Flow

The workflow is a series of API calls and manual approval steps:

1.  **Upload Sheet**: A CSV or XLSX file is uploaded and parsed.
    -   `POST /api/ultra-fast/upload-sheet`
2.  **Research**: For each row, deep research is performed.
    -   `POST /api/ultra-fast/research`
3.  **Proposals**: Asset proposals (scripts, images, videos, etc.) are generated.
    -   `POST /api/ultra-fast/proposals`
4.  **Approval**: The user manually approves or edits each asset.
    -   `POST /api/ultra-fast/approve`
5.  **Storyboard**: A storyboard is created with the approved assets.
    -   `POST /api/ultra-fast/storyboard`
6.  **Render**: The final video is rendered.
    -   `POST /api/ultra-fast/render`
7.  **Publish**: The video is published to YouTube after final approval.
    -   `POST /api/ultra-fast/publish`

## UI

A simple, step-by-step UI is available at `/ultra-fast` to guide the user through the process.

