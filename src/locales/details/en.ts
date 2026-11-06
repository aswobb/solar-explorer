export const detailText = {
  heading: 'Body profile', read: 'Read details', realValues: 'These are scientific reference values, separate from the display sizes, distances and playback speeds.',
  radius: 'Mean radius', distance: 'Orbital semi-major axis', orbitPeriod: 'Sidereal orbital period', rotationPeriod: 'Sidereal rotation period', tilt: 'Obliquity to orbit',
  notApplicable: 'Not applicable', solarOrbitNote: 'In this heliocentric model, an orbit of the Sun around itself is not applicable.',
  solarRotationNote: 'The Sun rotates at different rates at different latitudes. This is the adopted period at latitude 16°.',
  prograde: 'Prograde', retrograde: 'Retrograde', directionNote: 'Rotation periods are shown as positive durations with direction listed separately. Retrograde means rotation opposite to Earth’s.',
  definitionNote: 'Sidereal periods use distant stars as a reference and differ from day length. The semi-major axis is not the current distance from the Sun.',
  precisionNote: 'Rounded values for education: radius up to 1 decimal place, hours up to 2, orbital days up to 1, and angles up to 3. Not for precise predictions or calculations.',
  sources: 'Sources and definitions', source: 'Source', checked: 'Data retrieved',
  parent: 'Orbit center', moonNote: 'Satellite spin is synchronized with its display orbit. Circular orbits, axes and distances are illustrative; libration, resonances and eclipses are not simulated. Synchronous rotation hours are orbital days multiplied by 24; unavailable obliquities are omitted.',
  classes: { comet: 'Comet', 'dwarf-planet': 'Dwarf planet', asteroid: 'Asteroid', moon: 'Natural satellite', star: 'Star', terrestrial: 'Terrestrial planet', 'gas-giant': 'Gas giant', 'ice-giant': 'Ice giant' },
} as const
