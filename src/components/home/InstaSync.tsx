
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform, Vec2 } from 'ogl';
import { Button } from '@/components/ui/button';
import { Instagram, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useMedia } from '@/lib/media';

// --- OGL HELPER FUNCTIONS ---
function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any): void {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

// --- OGL MEDIA CLASS ---
interface MediaProps {
  element: HTMLImageElement | HTMLVideoElement;
  geometry: Plane;
  gl: Renderer['gl'];
  index: number;
  length: number;
  scene: Transform;
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  onClick: () => void;
}

class Media {
  element: HTMLImageElement | HTMLVideoElement;
  geometry: Plane;
  gl: Renderer['gl'];
  index: number;
  length: number;
  scene: Transform;
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  
  program: Program;
  plane: Mesh;
  texture: Texture;
  
  extra: number = 0;
  width: number = 0;
  height: number = 0;
  x: number = 0;
  y: number = 0;
  widthTotal: number = 0;

  isBefore: boolean = false;
  isAfter: boolean = false;

  onClick: () => void;

  constructor({ element, geometry, gl, index, length, scene, screen, viewport, onClick }: MediaProps) {
    autoBind(this);

    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.index = index;
    this.length = length;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.onClick = onClick;

    this.texture = new Texture(this.gl, { generateMipmaps: false });
    
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: /* glsl */ `
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
      fragment: /* glsl */ `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        varying vec2 vUv;
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          gl_FragColor = texture2D(tMap, uv);
        }
      `,
      uniforms: {
        tMap: { value: this.texture },
        uPlaneSizes: { value: new Vec2(0, 0) },
        uImageSizes: { value: new Vec2(0, 0) },
      },
    });

    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
    
    this.updateTexture();
  }

  updateTexture() {
    this.texture.image = this.element;
    if (this.element instanceof HTMLImageElement) {
        this.program.uniforms.uImageSizes.value = [this.element.naturalWidth, this.element.naturalHeight];
    } else if (this.element instanceof HTMLVideoElement) {
        this.program.uniforms.uImageSizes.value = [this.element.videoWidth, this.element.videoHeight];
    }
  }

  onResize({ screen, viewport }: { screen?: { width: number; height: number }; viewport?: { width: number; height: number } }) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    this.height = this.viewport.height * 0.8;
    this.width = this.height * 0.7; // Portrait aspect ratio

    this.plane.scale.x = this.width;
    this.plane.scale.y = this.height;

    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

    const padding = this.viewport.width * 0.1;
    this.widthTotal = (this.width + padding) * this.length;
    this.x = (this.width + padding) * this.index;
  }

  update(scroll: number, direction: 'left' | 'right') {
    this.plane.position.x = this.x - scroll - this.extra;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = false;
      this.isAfter = false;
    }

    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = false;
      this.isAfter = false;
    }

    this.updateTexture();
  }
}

// --- MAIN REACT COMPONENT ---
interface InstaSyncProps {
  items: { type: 'image' | 'video'; src: string; link: string }[];
}

const InstaSyncClient: React.FC<InstaSyncProps> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideo, setActiveVideo] = useState<HTMLVideoElement | null>(null);

  const { renderer, gl, camera, scene, medias, elements, scroll, getActiveIndex } = useWebGL(containerRef, items);

  const activeIndex = getActiveIndex ? getActiveIndex() : 0;
  const isCenterVideo = elements.current[activeIndex]?.tagName === 'VIDEO';

  const togglePause = useCallback(() => {
    setIsPaused(p => !p);
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCenterVideo && elements.current[activeIndex] instanceof HTMLVideoElement) {
      const video = elements.current[activeIndex] as HTMLVideoElement;
      video.muted = !video.muted;
      setIsMuted(video.muted);
      setActiveVideo(video);
    }
  }, [isCenterVideo, elements, activeIndex]);
  
  // Autoplay logic
  useEffect(() => {
    if (!scroll.current || !elements.current.length || isPaused) return;

    let timeoutId: NodeJS.Timeout;

    const advance = () => {
      const nextIndex = (activeIndex + 1) % elements.current.length;
      const mediaWidth = (medias.current[0]?.width || 0) + (medias.current[0]?.viewport.width * 0.1);
      scroll.current.target = nextIndex * mediaWidth;
    };

    const currentElement = elements.current[activeIndex];
    
    if (currentElement.tagName === 'VIDEO') {
      const video = currentElement as HTMLVideoElement;
      video.onended = advance;
      const playPromise = video.play();
      if(playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      timeoutId = setTimeout(advance, 5000);
    }

    return () => {
      if (currentElement.tagName === 'VIDEO') {
        (currentElement as HTMLVideoElement).onended = null;
      }
      clearTimeout(timeoutId);
    };
  }, [activeIndex, elements, scroll, isPaused, medias]);

  // Pause videos when not active
  useEffect(() => {
    elements.current.forEach((el, idx) => {
      if (el.tagName === 'VIDEO') {
        const video = el as HTMLVideoElement;
        if (idx === activeIndex && !isPaused) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          video.pause();
        }
      }
    });
  }, [activeIndex, elements, isPaused]);
  
   // Update active video for mute button
  useEffect(() => {
    if (isCenterVideo && elements.current[activeIndex] instanceof HTMLVideoElement) {
      const video = elements.current[activeIndex] as HTMLVideoElement;
      setActiveVideo(video);
      setIsMuted(video.muted);
    } else {
      setActiveVideo(null);
    }
  }, [isCenterVideo, elements, activeIndex]);
  

  return (
    <AnimateOnScroll animationType="fadeIn">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-headline text-primary">#KopiDuaDarjat</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Follow our journey and share your moments with us on Instagram. We love seeing our coffee in the wild!
        </p>
      </div>
      <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
        <div
          ref={containerRef}
          className="relative w-full h-[60vh] cursor-pointer group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute inset-0 z-10 pointer-events-none">
            {isCenterVideo && (
              <button 
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation();
                    toggleMute(e);
                  }}
                  className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white pointer-events-auto hover:bg-black/80"
              >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            )}

            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                togglePause();
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-4 bg-black/50 rounded-full text-white pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {isPaused ? <Play size={32} /> : <Pause size={32} />}
            </button>
          </div>
        </div>
      </Link>
      <AnimateOnScroll animationType="fadeIn" delay={0.4} className="mt-12 text-center">
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram className="mr-2 h-4 w-4" />
            Follow Us on Instagram
          </Link>
        </Button>
      </AnimateOnScroll>
    </AnimateOnScroll>
  );
};


// --- WEBGL HOOK ---
const useWebGL = (
  containerRef: React.RefObject<HTMLDivElement>,
  items: InstaSyncProps['items']
) => {
  const renderer = useRef<Renderer>();
  const gl = useRef<Renderer['gl']>();
  const camera = useRef<Camera>();
  const scene = useRef<Transform>();
  const planeGeometry = useRef<Plane>();
  const medias = useRef<Media[]>([]);
  const elements = useRef<(HTMLImageElement | HTMLVideoElement)[]>([]);

  const screen = useRef({ width: 0, height: 0 });
  const viewport = useRef({ width: 0, height: 0 });

  const scroll = useRef({
    ease: 0.05,
    current: 0,
    target: 0,
    last: 0,
    position: 0,
  });

  const isDown = useRef(false);
  const start = useRef(0);
  
  const getActiveIndex = useCallback(() => {
    if (!medias.current.length) return 0;
    const mediaWidth = (medias.current[0].width || 0) + (medias.current[0].viewport.width * 0.1);
    return Math.round(Math.abs(scroll.current.target) / mediaWidth) % items.length;
  }, [items.length]);

  const onMediaClick = useCallback(() => {
    window.open('https://www.instagram.com', '_blank');
  }, []);

  useEffect(() => {
    if (!containerRef.current || !items.length) return;

    renderer.current = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 2) });
    gl.current = renderer.current.gl;
    gl.current.clearColor(0, 0, 0, 0);
    containerRef.current.appendChild(gl.current.canvas as HTMLCanvasElement);

    camera.current = new Camera(gl.current);
    camera.current.fov = 45;
    camera.current.position.z = 20;

    scene.current = new Transform();
    planeGeometry.current = new Plane(gl.current, { heightSegments: 10, widthSegments: 10 });
    
    // Preload media elements
    elements.current = items.map(item => {
        if(item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            video.crossOrigin = 'anonymous';
            video.muted = true;
            video.loop = false; // Don't loop, we want the 'ended' event
            video.playsInline = true;
            return video;
        } else {
            const img = new Image();
            img.src = item.src;
            img.crossOrigin = 'anonymous';
            return img;
        }
    });

    const handleResize = () => {
      if (!containerRef.current || !renderer.current || !camera.current) return;
      screen.current = {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      };
      renderer.current.setSize(screen.current.width, screen.current.height);
      camera.current.perspective({ aspect: screen.current.width / screen.current.height });
      const fov = (camera.current.fov * Math.PI) / 180;
      const height = 2 * Math.tan(fov / 2) * camera.current.position.z;
      const width = height * camera.current.aspect;
      viewport.current = { width, height };

      medias.current.forEach(media => media.onResize({ screen: screen.current, viewport: viewport.current }));
    };

    const createMedias = () => {
        if (!gl.current || !planeGeometry.current || !scene.current) return;
        const duplicatedItems = [...elements.current, ...elements.current];
        medias.current = duplicatedItems.map((el, i) => new Media({
            element: el,
            geometry: planeGeometry.current!,
            gl: gl.current!,
            index: i,
            length: duplicatedItems.length,
            scene: scene.current!,
            screen: screen.current,
            viewport: viewport.current,
            onClick: onMediaClick
        }));
    };
    
    Promise.all(elements.current.map(el => new Promise(resolve => {
        if (el instanceof HTMLImageElement) el.onload = resolve;
        if (el instanceof HTMLVideoElement) el.onloadeddata = resolve;
    }))).then(() => {
        createMedias();
        handleResize();
    });


    // --- Interaction Handlers ---
    const onTouchDown = (e: MouseEvent | TouchEvent) => {
        isDown.current = true;
        scroll.current.position = scroll.current.current;
        start.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };
    const onTouchMove = (e: MouseEvent | TouchEvent) => {
        if (!isDown.current) return;
        const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const distance = (start.current - x) * 2;
        scroll.current.target = scroll.current.position + distance;
    };
    const onTouchUp = () => {
        isDown.current = false;
        if (!medias.current.length) return;
        const mediaWidth = (medias.current[0].width || 0) + (medias.current[0].viewport.width * 0.1);
        const itemIndex = Math.round(Math.abs(scroll.current.target) / mediaWidth);
        scroll.current.target = itemIndex * mediaWidth;
    };

    // --- Animation Loop ---
    let rafId: number;
    const update = () => {
      if (!renderer.current || !scene.current || !camera.current) return;
      scroll.current.current = lerp(scroll.current.current, scroll.current.target, scroll.current.ease);
      const direction = scroll.current.current > scroll.current.last ? 'right' : 'left';
      medias.current.forEach(media => media.update(scroll.current.current, direction));
      renderer.current.render({ scene: scene.current, camera: camera.current });
      scroll.current.last = scroll.current.current;
      rafId = window.requestAnimationFrame(update);
    };

    window.addEventListener('resize', handleResize);
    containerRef.current.addEventListener('mousedown', onTouchDown);
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchUp);
    containerRef.current.addEventListener('touchstart', onTouchDown);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchUp);
    
    update();

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousedown', onTouchDown);
      window.removeEventListener('mousemove', onTouchMove);
      window.removeEventListener('mouseup', onTouchUp);
      containerRef.current?.removeEventListener('touchstart', onTouchDown);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchUp);
      
      window.cancelAnimationFrame(rafId);
      containerRef.current?.removeChild(gl.current!.canvas as Node);
    };
  }, [items]);

  return { renderer, gl, camera, scene, medias, elements, scroll, getActiveIndex };
};

export default function InstaSync() {
  const { data: media } = useMedia();

  const instaItems = (media || [])
    .filter(item => item.id.startsWith('insta-post-'))
    .slice(0, 4)
    .map(item => ({
      type: 'image' as 'image' | 'video',
      src: item.imageUrl,
      link: '#'
    }));

  const mixedItems = [
    { type: 'video' as const, src: '/video/insta-1.mp4', link: '#' },
    ...instaItems,
  ];

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-12">
        <InstaSyncClient items={mixedItems} />
      </div>
    </section>
  );
}
