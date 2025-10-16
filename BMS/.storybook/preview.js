/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" }, // onClick, onChange 자동 Actions
    controls: { expanded: true },
    docs: { source: { type: "dynamic" } }, // Show code 자동
  },
};

export default preview;
