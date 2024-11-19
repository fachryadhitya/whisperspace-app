export const colors = [
  "Azure",
  "Crimson",
  "Golden",
  "Emerald",
  "Violet",
  "Sapphire",
  "Coral",
  "Indigo",
  "Amber",
  "Teal",
  "Ruby",
  "Pearl",
  "Jade",
  "Topaz",
  "Cobalt"
];

export const animals = [
  "Dolphin",
  "Penguin",
  "Koala",
  "Panda",
  "Otter",
  "Fox",
  "Rabbit",
  "Quokka",
  "Hedgehog",
  "Alpaca",
  "Lynx",
  "Seal",
  "Meerkat",
  "Raccoon",
  "Capybara"
];

export function generateWhimsicalName(seed: string): string {
  // Use the seed to consistently generate the same name for the same user
  const seedNumber = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = seedNumber % colors.length;
  const animalIndex = (seedNumber * 13) % animals.length; // Use prime number to reduce collisions
  
  return `${colors[colorIndex]} ${animals[animalIndex]}`;
}
