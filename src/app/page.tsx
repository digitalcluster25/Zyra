export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Zyra - Project Management
        </h1>
        
        {/* Tailwind CSS Demo Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Tailwind CSS is Working! 🎨
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                Responsive Grid
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This layout adapts to screen size using Tailwind&apos;s responsive classes
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
                Dark Mode
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Toggle your system theme to see dark mode in action
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-2">
                Utility Classes
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Built with Tailwind&apos;s utility-first approach
              </p>
            </div>
          </div>
        </div>

        {/* Buttons Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Interactive Elements
          </h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Primary Button
            </button>
            <button className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200">
              Secondary Button
            </button>
            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:border-gray-400 transition-colors duration-200">
              Outline Button
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
