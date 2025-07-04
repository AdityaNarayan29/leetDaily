module.exports = {
  darkMode: 'class', // important!
  content: [
    "./**/*.html",
    "./**/*.js",
  ],
  safelist: [
    "bg-green-100", "text-green-800", "dark:bg-green-900/30", "dark:text-green-300",
    "bg-orange-100", "text-orange-800", "dark:bg-orange-900/30", "dark:text-orange-300",
    "bg-red-100", "text-red-800", "dark:bg-red-900/30", "dark:text-red-300",
    "inline-flex", "items-center", "px-2", "py-0.5", "rounded", "text-xs", "font-medium",
    "ml-2", "mr-1", "mb-1",
    "border", "border-neutral-300", "bg-neutral-100", "text-neutral-800",
    "dark:border-neutral-600", "dark:bg-neutral-800", "dark:text-white",
    "underline", "underline-offset-2", "decoration-current", "decoration-2",
    "cursor-pointer", "text-inherit", "focus:outline-none",
    "hidden", "flex", "flex-wrap", "space-y-1", "text-blue-600", "dark:text-blue-400", "hover:underline"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
