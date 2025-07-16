import React from "react";
import { Particles } from "react-tsparticles";
import { tsParticles } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

loadSlim(tsParticles);

function AdminParticlesBackground() {
  return (
    <Particles
      id="adminParticles"
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: {
          color: { value: "#f9f9f9" },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5,
              },
            },
          },
        },
        particles: {
          number: {
            value: 50,
            density: {
              enable: true,
              area: 900,
            },
          },
          color: {
            value: "#d54343",
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.6,
            random: { enable: true, minimumValue: 0.3 },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.3,
              sync: false,
            },
          },
          size: {
            value: 8,
            random: { enable: true, minimumValue: 1 },
            animation: {
              enable: true,
              speed: 4,
              minimumValue: 1,
              sync: false,
            },
          },
          links: {
            enable: true,
            distance: 150,
            color: "#d54343",
            opacity: 0.3,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "bounce",
            },
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}

export default AdminParticlesBackground;