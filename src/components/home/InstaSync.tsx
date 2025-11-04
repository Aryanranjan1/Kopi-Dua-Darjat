
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform, Vec2 } from 'ogl';
import { Button } from '@/components/ui/button';
import { Instagram, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Default Media Items ---
const defaultItems = [
  { type: 'video', src: 'https://cdn.pixabay.com/video/2024/04/25/209419_large.mp4', text: 'Latte Art' },
  { type: 'image', src: 'https://picsum.photos/seed/insta-reel-1/450/800', text: 'Iced Coffee' },
  { type: 'video', src: 'https://cdn.pixabay.com/video/2024/04/25/209424_large.mp4', text: 'Pour Over' },
  { type: 'image', src: 'https://picsum.photos/seed/insta-reel-2/450/800', text: 'Cafe Interior' },
  { type: 'video', src: 'https://cdn.pixabay.com/video/2020/08/12/46989-449623829_large.mp4', text: 'Coffee Beans' },
  { type: 'image', src: 'https://picsum.photos/seed/insta-reel-3/450/800', text: 'Friends Sharing' },
  { type: 'video', src: 'https://cdn.pixabay.com/video/2024/04/25/209419_large.mp4', text: 'Morning Brew' },
  { type: 'image', src: 'https://picsum.photos/seed/insta-reel-4/450/800', text: 'Kopi Stall' },
];


// --- Helper Functions ---
function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

// --- WebGL Logic in a React Hook ---

const useWebGL = (containerRef: React.RefObject<HTMLDivElement>, items: typeof defaultItems) => {
  const renderer = useRef<Renderer | null>(null);
  const gl = useRef<Renderer['gl'] | null>(null);
  const camera = useRef<Camera | null>(null);
  const scene = useRef<Transform | null>(null);
  const planeGeometry = useRef<Plane | null>(null);
  const medias = useRef<Media[]>([]);
  const elements = useRef<Array<HTMLImageElement | HTMLVideoElement>>([]);
  const scroll = useRef({ ease: 0.05, current: 0, target: 0, last: 0, position: 0 });
  const isDown = useRef(false);
  const start = useRef(0);
  const raf = useRef(0);
  const viewport = useRef({ width: 0, height: 0 });
  const screen = useRef({ width: 0, height: 0 });


  const onResize = useCallback(() => {
    if (!renderer.current || !camera.current) return;
    screen.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    renderer.current.setSize(screen.current.width, screen.current.height);
    camera.current.perspective({ aspect: gl.current!.canvas.width / gl.current!.canvas.height });

    const fov = camera.current.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * camera.current.position.z;
    viewport.current = { width: height * camera.current.aspect, height };

    medias.current.forEach(media => media.onResize({ screen: screen.current, viewport: viewport.current }));
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    renderer.current = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    gl.current = renderer.current.gl;
    containerRef.current.appendChild(gl.current.canvas as Node);

    camera.current = new Camera(gl.current, { fov: 45 });
    camera.current.position.z = 20;

    scene.current = new Transform();
    planeGeometry.current = new Plane(gl.current, { heightSegments: 50, widthSegments: 100 });

    const mediaItems = [...items, ...items]; // Duplicate for infinite loop
    elements.current = mediaItems.map(item => {
      let el: HTMLImageElement | HTMLVideoElement;
      if (item.type === 'image') {
        el = new Image();
        el.crossOrigin = 'anonymous';
        el.src = item.src;
      } else {
        el = document.createElement('video');
        el.crossOrigin = 'anonymous';
        el.src = item.src;
        el.loop = false;
        el.muted = true;
        el.playsInline = true;
      }
      return el;
    });

    medias.current = elements.current.map((el, i) => new Media({
      element: el,
      geometry: planeGeometry.current!,
      gl: gl.current!,
      index: i,
      length: elements.current.length,
      scene: scene.current!,
      screen: screen.current,
      viewport: viewport.current,
      bend: 5,
      borderRadius: 0.05
    }));
    
    onResize();

    const onTouchDown = (e: MouseEvent | TouchEvent) => {
      isDown.current = true;
      scroll.current.position = scroll.current.current;
      start.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };

    const onTouchMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown.current) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const distance = (start.current - x) * 0.01;
      scroll.current.target = scroll.current.position + distance;
    };
    
    const onTouchUp = () => {
      isDown.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      scroll.current.target += e.deltaY * 0.003;
    };

    const update = () => {
      scroll.current.current = lerp(scroll.current.current, scroll.current.target, scroll.current.ease);
      const direction = scroll.current.current > scroll.current.last ? 'right' : 'left';
      medias.current.forEach(media => media.update(scroll.current, direction));
      renderer.current!.render({ scene: scene.current!, camera: camera.current! });
      scroll.current.last = scroll.current.current;
      raf.current = window.requestAnimationFrame(update);
    };

    update();
    
    // Add event listeners
    window.addEventListener('resize', onResize);
    window.addEventListener('wheel', onWheel);
    window.addEventListener('mousedown', onTouchDown);
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchUp);
    window.addEventListener('touchstart', onTouchDown);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchUp);


    return () => {
      window.cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousedown', onTouchDown);
      window.removeEventListener('mousemove', onTouchMove);
      window.removeEventListener('mouseup', onTouchUp);
      window.removeEventListener('touchstart', onTouchDown);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchUp);
      containerRef.current?.removeChild(gl.current!.canvas as Node);
    };
  }, [items, onResize]);

  return { renderer, gl, camera, scene, medias, elements, scroll };
};


// --- Media Class for OGL ---
class Media {
  element: HTMLImageElement | HTMLVideoElement;
  geometry: Plane;
  gl: Renderer['gl'];
  index: number;
  length: number;
  scene: Transform;
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  plane!: Mesh;
  program!: Program;
  
  extra: number = 0;
  width: number = 0;
  widthTotal: number = 0;
  x: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;
  bend: number;
  borderRadius: number;

  constructor({ element, geometry, gl, index, length, scene, screen, viewport, bend, borderRadius }: any) {
    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.index = index;
    this.length = length;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.bend = bend;
    this.borderRadius = borderRadius;

    this.createMesh();
    this.onResize();
  }

  createMesh() {
    const texture = new Texture(this.gl, { generateMipmaps: false });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        // From https://www.iquilezles.org/articles/distfunctions2d/
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
            vec2 q = abs(p) - b;
            return length(max(q,0.0)) + min(max(q.x,q.y),0.0) - r;
        }

        void main() {
            vec2 ratio = vec2(
              min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
              min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
            );

            vec2 uv = vec2(
              vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
              vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
            );
          
            vec4 color = texture2D(tMap, uv);
            
            float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius, 0.5 - uBorderRadius), 0.0);
            
            if (d > uBorderRadius) discard;

            gl_FragColor = color;
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: new Vec2(0, 0) },
        uImageSizes: { value: new Vec2(0, 0) },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });
    
    if (this.element instanceof HTMLImageElement) {
        this.element.onload = () => {
            texture.image = this.element;
            this.program.uniforms.uImageSizes.value = [this.element.width, this.element.height];
        };
    } else { // HTMLVideoElement
        this.element.oncanplay = () => {
            texture.image = this.element;
            this.program.uniforms.uImageSizes.value = [this.element.videoWidth, this.element.videoHeight];
        };
    }
    
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  onResize({ screen, viewport }: { screen?: {width: number, height: number}, viewport?: {width: number, height: number} } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    const scale = this.screen.height / 1500; // Adjust scale factor
    this.plane.scale.y = this.viewport.height * 0.8; // Use 80% of viewport height
    this.plane.scale.x = this.plane.scale.y * (9 / 16); // Enforce 9:16 aspect ratio

    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    
    const padding = this.viewport.width * 0.1; // 10% of viewport width as padding
    this.width = this.plane.scale.x + padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }

  update(scroll: { current: number }, direction: 'right' | 'left') {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    const B_abs = Math.abs(this.bend);
    const R = (H * H + B_abs * B_abs) / (2 * B_abs);
    const effectiveX = Math.min(Math.abs(x), H);
    
    const arc = R - Math.sqrt(Math.max(0, R * R - effectiveX * effectiveX));
    if (this.bend > 0) {
      this.plane.position.y = -arc;
      this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
    } else {
      this.plane.position.y = arc;
      this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
    }

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
}

// --- React Component ---

const InstaSyncClient = ({ items }: { items: typeof defaultItems }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const webGLStuff = useWebGL(containerRef, items);

  return (
    <div className="relative w-full h-[600px] cursor-grab active:cursor-grabbing" ref={containerRef} />
  );
};


export default function InstaSync() {
  return (
     <section className="py-24 sm:py-32 bg-background w-full overflow-hidden">
      <AnimateOnScroll animationType="fadeIn">
        <div className="text-center mb-12 px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-primary">#KopiDuaDarjat</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Follow our journey and share your moments with us on Instagram. We love seeing our coffee in the wild!
          </p>
        </div>
      </AnimateOnScroll>
      
      <div className="w-full">
        <InstaSyncClient items={defaultItems} />
      </div>

      <AnimateOnScroll animationType="fadeIn" delay={0.4} className="mt-12 text-center">
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram className="mr-2 h-4 w-4" />
            Follow Us on Instagram
          </Link>
        </Button>
      </AnimateOnScroll>
    </section>
  );
}
