# Solar System Scope textures

© Solar System Scope / INOVE. [Source collection](https://www.solarsystemscope.com/textures/) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). No endorsement is implied.

Nine 2048×1024 JPEG maps for Sun, Mercury, Venus (surface), Earth (day map), Mars, Jupiter, Saturn, Uranus and Neptune. Source maps use NASA imagery/elevation with artistic color adjustment and reconstructed gaps. Venus is a below-cloud surface visualization, not its visible cloud cover.

Original site returned HTTP403 in this environment. Files were retrieved unchanged on 2026-10-21 from the [Sanghel mirror at fixed commit c826ebef5762074e5c8ba696254bedb0d3694757](https://github.com/Sanghel/solar-system-3d/tree/c826ebef5762074e5c8ba696254bedb0d3694757/public/textures), whose README attributes these maps to Solar System Scope under CC BY 4.0. We did not independently compare mirror bytes with the inaccessible original downloads.

Image bytes are unchanged from the mirror; sphere projection, sRGB color management and lighting are runtime display treatments. Individual paths, sizes, SHA256 and original/mirror URLs: [manifest.json](manifest.json). No satellites or sky maps were imported.

## Earth layers (T14)

Night map and clouds: © Solar System Scope / INOVE, CC BY 4.0, same source/license links as above. Retrieved 2026-10-21 from [Whitebee7 mirror at fixed commit](https://github.com/Whitebee7/solarsystem/tree/235e72c02e825e0c8d0792ec0aa6be43e1a14f68/textures). Its README credits Solar System Scope. Both files remain unchanged from the mirror; original-site bytes were not independently compared. [Per-file provenance and SHA256](earth-manifest.json). The cloud JPEG is a grayscale opacity map; runtime uses its green channel as alpha. Night brightness, cloud drift, shell height and blue atmospheric rim are artistic runtime treatments, not live weather or physically accurate scattering.

## Saturn ring (T15)

© Solar System Scope / INOVE, CC BY 4.0 (same source/license links above). The 2048×125 RGBA radial strip was retrieved unchanged on 2026-10-21 from the same fixed Whitebee7 mirror commit as the Earth layers. The source collection download points to 2k_saturn_ring_alpha.png. [Per-file URLs, dimensions and SHA256](ring-manifest.json). Original-site bytes were not independently compared. Radial UV mapping, geometry dimensions, opacity threshold and lighting are runtime display treatments.
