import { Box, Text, Select } from "@chakra-ui/react";
const GameModeSelector = ({ currentMode, onChange }) => (
  <Box mb={4}>
    <Text fontWeight="bold" mb={2}>
      Game Mode / Timer
    </Text>
    <Select
      value={currentMode || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value={15000}>Chaos (15s per turn)</option>
      <option value={30000}>Normal (30s per turn)</option>
      <option value={60000}>Relaxed (60s per turn)</option>
    </Select>
  </Box>
);
export default GameModeSelector;
