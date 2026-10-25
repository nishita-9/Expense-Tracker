# Expense Tracker Mobile Application

A simple mobile application developed as part of the **Mobile Application Development (MAD)** project. The app helps users record daily expenses, organize them into categories, and monitor spending against a budget.

## Features
- **Add expenses** with a title, amount, and category.
- **Categorize transactions** as Food, Transport, Education, Shopping, Entertainment, Bills, or Other.
- **View expense summaries**, including total spending, transaction count, and average expense.
- **Manage a budget** by setting or updating the budget amount.
- **Monitor budget usage** with remaining-budget information and a progress indicator.
- **Delete expenses** after confirmation.
- **Save data locally** so expenses and budget information can be restored when the app is reopened.
- **Validate inputs** to help prevent invalid expense and budget entries.

## Technology Stack
| Technology | Purpose |
|---|---|
| React Native | Mobile user interface |
| TypeScript / TSX | Application code and UI |
| React Hooks | State management and lifecycle effects |
| AsyncStorage | Local persistent storage |
| Node.js and npm | JavaScript development tools and package management |
| Visual Studio Code | Code editor |
| Android SDK and Android Emulator | Android build, run, and testing environment |
| Gradle | Android build system |

## Getting Started

### Prerequisites
Install and configure the following tools:

- Node.js and npm
- Java Development Kit (JDK) compatible with the project's React Native version
- Android Studio / Android SDK
- Android Emulator or a connected Android device
- Visual Studio Code (recommended)

For environment setup, follow the official [React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment).

### Installation
1. Clone this repository or download the project.
2. Open a terminal in the project folder.
3. Install the project dependencies:

   ```bash
   npm install
   ```
4. Make sure an Android emulator is running or an Android device is connected and debugging is enabled.

### Run the App
In the project directory, start in one terminal:
```bash
npm start
```

Open a second terminal in the project directory and run:
```bash
npm run android
```

## How to Use
1. Open the Expense Tracker app.
2. Review the dashboard and current budget summary.
3. Enter an expense title and amount.
4. Select the relevant expense category.
5. Save the expense and check the updated summary.
6. Use the budget controls to update your budget.
7. Delete a transaction if needed and confirm the action.
8. Close and reopen the app to verify that saved data is restored.

The project includes sample transactions for demonstration when no saved user data has replaced them.

## Data Storage
The app uses **AsyncStorage** to store the expense list and budget locally on the device. It does not currently require an online account, remote backend, or cloud database. Local storage is not the same as cloud backup, and data is not automatically synchronized across devices.

## Current Limitations
- No cloud synchronization or online backup.
- No user authentication.
- No dedicated monthly/yearly reports or charts.
- Expense editing and other advanced reporting features may be added in a future version.

## Future Improvements
- Monthly and yearly expense reports.
- Charts showing spending by category.
- Search and filter expenses by date or category.
- Edit existing transactions.
- Budget-limit reminders and notifications.
- User authentication and optional cloud synchronization.

## Project Structure
This project was created with the React Native CLI. The main application interface and logic are implemented in `App.tsx`. Other files and folders are generated or maintained by the React Native project setup, including `package.json` and the `android/` directory.

```text
ExpenseTracker/
├── App.tsx
├── package.json
├── android/
├── node_modules/       # Installed dependencies; do not upload to GitHub
└── README.md
```

## Academic Project
**Project:** Expense Tracker Mobile Application  
**Subject:** Mobile Application Development (MAD)  
**Institute:** A. D. Patel Institute of Technology  
**University:** The Charutar Vidya Mandal (CVM) University

## References
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)

Developed as an academic project to demonstrate mobile UI development, state management, input validation, calculations, and local data persistence.