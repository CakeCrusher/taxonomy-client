# **Client README**

# Taxonomy Generator Client

A React application providing a user-friendly interface for generating and managing taxonomies using AI.

## Overview

This client application allows users to interact with the Taxonomy Synthesis API to generate categories and classify items. It provides a graphical interface using React Flow to visualize and manipulate the taxonomy tree.

## Directory Structure

```
.
├── README.md        
├── package-lock.json
├── package.json     
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── EditNodeModal.tsx
│   ├── NodeComponent.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── logo.svg
│   ├── models.ts
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   └── setupTests.ts
└── tsconfig.json
```

## Requirements

- Node.js (version 14 or higher)
- An OpenAI API key
- The Taxonomy Synthesis API backend running locally or accessible via network

## Quickstart

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

Install the required npm packages.

```bash
npm install
```

### 3. Configure the Application

Ensure that the backend API is running and accessible at `http://localhost:4000`. If it's running on a different host or port, update the API endpoints in `App.tsx`.

### 4. Run the Application

Start the React development server.

```bash
npm start
```

This will run the application on `http://localhost:3000`.

### 5. Use the Application

- **Enter OpenAI API Key:** In the input field at the top left, enter your OpenAI API key.
- **Set Number of Categories:** Specify how many subcategories to generate when creating new categories.
- **Interact with the Tree:**
  - **Generate Categories:** Click the "Generate Categories" button on a node to create subcategories using AI.
  - **Classify Items:** Click the "Classify Items" button to classify the items of a node into its subcategories using AI.
  - **Edit Nodes:** Edit the category name and description directly within the node.
  - **Delete Nodes:** Click the "Delete Node" button to remove a node from the tree.
  - **Drag Nodes:** Drag nodes around the canvas to rearrange the layout.

### 6. Sample Data

The application starts with some sample items. You can modify the `sampleItems` array in `App.tsx` to use your own data.

```typescript
const sampleItems: Item[] = [
  { id: 'item1', name: 'Item 1' },
  { id: 'item2', name: 'Item 2' },
  { id: 'item3', name: 'Item 3' },
  // Add more items as needed
];
```

## Dependencies

Ensure the following dependencies are included in your `package.json`:

- `react`
- `react-dom`
- `react-scripts`
- `typescript`
- `react-flow-renderer`
- `axios`
- `dagre`

## Project Structure

- **App.tsx:** Main application file that handles state management and API interactions.
- **NodeComponent.tsx:** Custom node component representing each category node in the tree.
- **models.ts:** TypeScript interfaces representing data models.
- **EditNodeModal.tsx:** Component for editing node details (if implemented).
- **public/:** Contains the HTML template and public assets.
- **src/:** Contains all the source code for the application.

## Customization

- **Styles:** Customize the appearance by modifying CSS files or inline styles.
- **Components:** Extend or modify components to add new features or change behavior.
- **State Management:** For larger applications, consider integrating a state management library like Redux.

## Notes

- **OpenAI API Key:** The application requires your OpenAI API key to function. Ensure you have a valid key and understand any associated costs.
- **API Endpoint Configuration:** If your backend API is hosted elsewhere, update the API URLs in `App.tsx`.
- **Error Handling:** Basic error handling is included. Enhance it as needed for production use.

## Contact

For any questions or issues, please contact the project maintainer.

---

**Happy coding! If you have any questions or need further assistance, feel free to reach out.**