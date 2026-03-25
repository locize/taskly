export default {
  locales: [
    "en",
    "de",
    "fr",
    "it",
    "es",
    "ja"
  ],
  extract: {
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "public/locales/{{language}}/{{namespace}}.json"
  },
  locize: {
    projectId: 'b82c87d5-57b5-4ee9-af93-7a79f38320ff',
    // For security, apiKey is best set via an environment variable
    apiKey: '1912955c-029a-464f-974e-1591da6aec6c',
    version: 'latest',
  }
}