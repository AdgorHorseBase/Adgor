# Blog Builder and Viewer

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (includes npm)

### Running the Project

#### 1. Clone the Repository

```bash
git clone https://github.com/AdgorHorseBase/Adgor.git
```

#### 2. Running the Frontend (Client)
  1. **Open a terminal in the root directory**:
  2. **Install the required dependencies**:
```bash
npm install
```
  3. **Run the frontend**:
```bash
npm start
```
The frontend should now be running on `http://localhost:3000`

#### 3. Running the Backend (Server) for Editing
  1. **Navigate to the `public/server` directory**:
```bash
cd public/server
```
  2. **Install the required dependencies**:
```bash
npm install
```
  3. **Start the server**:
```bash
npm start
```
The backend (admin panel) should now be running on `http://localhost:8080`

### Explanation for a 6-Year-Old

- **Frontend (Client)**: This is the part of the website that everyone can see and use. You don't need the backend to see the website. Just open a terminal in the root directory, type `npm install` to get everything ready, and then type `npm start` to see the website at `http://localhost:3000`.

- **Backend (Server) for Editing**: This is the part where you can make changes to the website. To edit the website, you need to run the backend. Go to the `public/server` directory, type `npm install` to get everything ready, and then type `npm start` to open the admin panel at `http://localhost:8080`.

## Contributing
We welcome contributions to this project! To contribute, follow these steps:

  1. **Fork the repository**: Instead of cloning the repository directly, fork it by clicking the "Fork" button in the upper right corner of the GitHub page.

  2. **Clone your fork**: Once you've forked the repo, clone your forked repository:
```bash
git clone https://github.com/your-username/your-forked-repository.git
```
  3. **Make changes**: commit and push your changes to your repository 
  4. **Submit a Pull Request**

## IMPORTANT
  - The `admin panel` is on "/admin"
  - After running the project you need to create a page (with the `create` button in the admin panel) with **Path** `index` and this page will show on "/"