# Social Asset Analyzer (人脉资本分析器)

A 3D visualization and strategic analysis tool for personal network management. This application helps you visualize your social capital across three dimensions: Value Relevance (X), Energy Level (Y), and Accessibility (Z), classifying relationships into strategic categories to guide networking decisions.

![Social 3D](public/vite.svg)

## Key Features

- **3D Visualization**: Explore your network in an interactive 3D space.
- **Strategic Classification**: Automatically categorizes contacts based on customizable thresholds:
    - **Core Power (权利内核)**: High Value, High Energy, High Access.
    - **Strategic Goal (战略目标)**: High Value, High Energy, Low Access.
    - **Execution Force (执行部队)**: High Value, High Access, Low Energy.
    - **Prestige Leverage (声望杠杆)**: High Energy, Low Value.
- **Dashboard Analytics**: Get real-time insights into your network's composition, energy deficits, and strategic gaps.
- **Contact Management**: Add, edit, and manage contact details with note-taking capabilities.
- **Customizable Logic**: Adjust the classification thresholds in Settings to fit your specific networking strategy.
- **Bilingual Support**: Fully localized in English and Chinese.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Relationship-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Tech Stack

- **Framework**: React 18 + Vite
- **3D Engine**: Three.js + React Three Fiber (@react-three/drei)
- **Styling**: Tailwind CSS + Framer Motion
- **Icons**: Lucide React

## License

MIT