export const orbiterIds=['iss','hubble'] as const
export type OrbiterId=typeof orbiterIds[number]
export const missionIds=['voyager1','newhorizons'] as const
export type MissionId=typeof missionIds[number]
export const spacecraftCheckedOn='2026-11-06'
/** Representative references, never a live TLE or timestamped state vector. */
export const orbiters={
 iss:{kind:'earth-satellite',altitudeKm:400,inclinationDeg:51.6,periodMinutes:92,source:'https://esrs.jsc.nasa.gov/Tools/orbitTutorial.htm',altitudeSource:'https://science.nasa.gov/earth/earth-observatory/human-spaceflight-factsheet/',radius:1.65,phase:0.5,displaySeconds:24,color:'#e5b77d'},
 hubble:{kind:'earth-satellite',altitudeKm:483,inclinationDeg:28.5,periodMinutes:95,source:'https://science.nasa.gov/mission/hubble/overview/about-hubble/',altitudeSource:'https://science.nasa.gov/mission/hubble/overview/hubble-by-the-numbers/',radius:2.2,phase:3.2,displaySeconds:24*95/92,color:'#a6cafa'},
} as const
export type MissionEventId='launch'|'jupiter'|'saturn'|'portrait'|'interstellar'|'pluto'|'arrokoth'
export type RouteNode={id:MissionEventId;date:string;position:readonly[number,number,number];positionKind:'illustrative'}
const node=(id:MissionEventId,date:string,position:readonly[number,number,number]):RouteNode=>({id,date,position,positionKind:'illustrative'})
export const missions={
 voyager1:{kind:'deep-space-probe',source:'https://science.nasa.gov/mission/voyager/voyager-1/',coordinateFrame:'heliocentric-schematic-not-J2000',routeKind:'artistic-interpolation',nodes:[node('launch','1977-09-05',[4,0,0]),node('jupiter','1979-03-05',[10,0,8]),node('saturn','1980-11-12',[18,2,12]),node('portrait','1990-02-14',[25,12,16]),node('interstellar','2012-08-25',[36,23,20])]},
 newhorizons:{kind:'deep-space-probe',source:'https://science.nasa.gov/mission/new-horizons/',coordinateFrame:'heliocentric-schematic-not-J2000',routeKind:'artistic-interpolation',nodes:[node('launch','2006-01-19',[4,0,0]),node('jupiter','2007-02-28',[12,0,6]),node('pluto','2015-07-14',[28,1,18]),node('arrokoth','2019-01-01',[39,2,24])]},
} as const
