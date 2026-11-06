# Solar System Scope textures

© Solar System Scope / INOVE. [Source collection](https://www.solarsystemscope.com/textures/) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). No endorsement is implied.

Nine 2048×1024 JPEG maps for Sun, Mercury, Venus (surface), Earth (day map), Mars, Jupiter, Saturn, Uranus and Neptune. Source maps use NASA imagery/elevation with artistic color adjustment and reconstructed gaps. Venus is a below-cloud surface visualization, not its visible cloud cover.

Original site returned HTTP403 in this environment. Files were retrieved unchanged on 2026-10-21 from the [Sanghel mirror at fixed commit c826ebef5762074e5c8ba696254bedb0d3694757](https://github.com/Sanghel/solar-system-3d/tree/c826ebef5762074e5c8ba696254bedb0d3694757/public/textures), whose README attributes these maps to Solar System Scope under CC BY 4.0. We did not independently compare mirror bytes with the inaccessible original downloads.

Image bytes are unchanged from the mirror; sphere projection, sRGB color management and lighting are runtime display treatments. Individual paths, sizes, SHA256 and original/mirror URLs: [manifest.json](manifest.json). No satellites or sky maps were imported.

## Earth layers (T14)

Night map and clouds: © Solar System Scope / INOVE, CC BY 4.0, same source/license links as above. Retrieved 2026-10-21 from [Whitebee7 mirror at fixed commit](https://github.com/Whitebee7/solarsystem/tree/235e72c02e825e0c8d0792ec0aa6be43e1a14f68/textures). Its README credits Solar System Scope. Both files remain unchanged from the mirror; original-site bytes were not independently compared. [Per-file provenance and SHA256](earth-manifest.json). The cloud JPEG is a grayscale opacity map; runtime uses its green channel as alpha. Night brightness, cloud drift, shell height and blue atmospheric rim are artistic runtime treatments, not live weather or physically accurate scattering.

## Saturn ring (T15)

© Solar System Scope / INOVE, CC BY 4.0 (same source/license links above). The 2048×125 RGBA radial strip was retrieved unchanged on 2026-10-21 from the same fixed Whitebee7 mirror commit as the Earth layers. The source collection download points to 2k_saturn_ring_alpha.png. [Per-file URLs, dimensions and SHA256](ring-manifest.json). Original-site bytes were not independently compared. Radial UV mapping, geometry dimensions, opacity threshold and lighting are runtime display treatments.


## Moon (2026-11-02)

`moon.jpg`: © Solar System Scope / INOVE, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). [Source](https://www.solarsystemscope.com/textures/), [original 2K download](https://www.solarsystemscope.com/textures/download/2k_moon.jpg). Downloaded original bytes unchanged; lighting and synchronous rotation applied at runtime. Hash and dimensions recorded in manifest.json.


## P2 satellite maps (2026-11-02)

`io.jpg`, `europa.jpg`, `ganymede.jpg`, `callisto.jpg`, `titan.jpg` are NASA/USGS mission mosaics, distributed as public-domain imagery by the source mirror. Credit: NASA/JPL/USGS (Voyager / Galileo for Jovian moons; Cassini ISS for Titan). They are **not** Solar System Scope CC BY textures.

Retrieved unchanged from [Sanghel/solar-system-3d at 47c8bbc6b63f4c6c2310911238c2c4b6bff6d20b](https://github.com/Sanghel/solar-system-3d/tree/47c8bbc6b63f4c6c2310911238c2c4b6bff6d20b/public/textures/satellites). [Pinned source attribution](https://github.com/Sanghel/solar-system-3d/blob/47c8bbc6b63f4c6c2310911238c2c4b6bff6d20b/public/textures/README.md). See `satellites-manifest.json` for direct URLs, SHA-256, byte sizes and actual dimensions. Callisto is 1024×498; the other maps are 1024×512. They are approximately equirectangular visualization maps.

Mirror attribution identifies USGS Astrogeology products. The USGS product pages returned HTTP 403 during retrieval, so exact original-image matching and any preprocessing by the mirror have not been independently verified. Downloaded mirror bytes are unchanged here; lighting is applied at runtime. Titan's grayscale surface mosaic receives a warm display tint and does not depict its natural visible-light atmosphere.

Related USGS products: [Io](https://astrogeology.usgs.gov/search/map/io_galileo_ssi_global_color_merge_mosaic_1km), [Europa](https://astrogeology.usgs.gov/search/map/europa_voyager_galileo_ssi_global_mosaic_500m), [Ganymede](https://astrogeology.usgs.gov/search/map/ganymede_voyager_galileo_ssi_global_mosaic_1km), [Callisto](https://astrogeology.usgs.gov/search/map/callisto_galileo_voyager_simple_cylindrical_global_map), [Titan](https://astrogeology.usgs.gov/search/map/titan_cassini_iss_near_global_mosaic_450m).


## Additional Saturn moons (2026-11-02)

`mimas.jpg`, `enceladus.jpg`, `tethys.jpg`, `dione.jpg`, `rhea.jpg`, `iapetus.jpg`: downloaded directly from the official [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources/tree/11ebb4ee043715aefbba6aeec8a61746fad67fa7/Images%20and%20Textures) repository at commit `11ebb4ee043715aefbba6aeec8a61746fad67fa7`. Credit: NASA/JPL. The repository [README](https://github.com/nasa/NASA-3D-Resources/blob/11ebb4ee043715aefbba6aeec8a61746fad67fa7/README.md) describes its assets as free and without copyright; recorded as Public-Domain.

All six are 1440×720 surface maps. Original JPEG bytes are unchanged; sphere mapping, schematic synchronous rotation and lighting are applied at runtime. Direct original URLs, hashes and byte counts are in `satellites-manifest.json`. These six official downloads do not share the original-byte matching limitation of the five P2 mirror assets above.


## P3 Ceres and Vesta (2026-11-02)

`ceres.jpg` and `vesta.jpg`: NASA Visualization Technology Applications and Development (VTAD), from the official [Ceres model](https://science.nasa.gov/resource/ceres-3d-model/) and [Vesta model](https://science.nasa.gov/resource/vesta-3d-model/). NASA-produced visualization imagery is recorded as Public-Domain; no NASA endorsement is implied.

The embedded base-color image (image index 1, `ceres_diff.jpg` / `vesta_diff.jpg`, encoded as PNG in the source GLB) was extracted, resized to 2048×1024, and encoded as JPEG at quality 90. Only the surface map is used; these are spherical approximations rather than the NASA model geometry. Source GLB URLs and SHA-256, output image hashes, dimensions, byte counts, credit and transformations are recorded in `small-bodies-manifest.json`. Lighting and spin are added at runtime.


## P4 Pluto and illustrative outer dwarfs (2026-11-02)

`pluto.jpg`: NASA Visualization Technology Applications and Development (VTAD), from the official [Pluto 3D Model](https://science.nasa.gov/resource/pluto-3d-model/). Extracted embedded base-color `pluto_equi.jpg` (PNG-encoded in GLB), resized to 2048×1024, JPEG quality 90. NASA-produced visualization imagery is recorded as Public-Domain. Source GLB URL/hash, output hash, size and transformations are in `outer-manifest.json`.

Eris, Haumea and Makemake have **no surface image files** in this project. Their materials are illustrative plain colors; Haumea's elongated geometry is an artistic approximation, not measured axis ratios. The UI explicitly labels these appearances. Pluto's mapped details/colors also remain visualization approximations. Decorative star points and Kuiper background particles are procedural geometry, not observed positions or discoverable individual bodies.

## P5–P8 程序视觉补充（2026-11-06）
哈雷彗核/彗发/双尾、奥尔特云点云、空间站/哈勃/深空探测器模型和路线均由项目程序生成；没有新增外部图像或模型文件。NASA历史事件与代表性轨道数据的来源、参考日期和示意边界见项目文档 `docs/COMETS.md`、`docs/OORT-CLOUD.md`、`docs/SPACECRAFT.md`。上述程序视觉不属于本目录纹理的第三方图片授权范围。
