
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
  bend: number;
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
  bend: number;
  
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

  speed: number = 0;

  constructor({ element, geometry, gl, index, length, scene, screen, viewport, bend }: MediaProps) {
    autoBind(this);

    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.index = index;
    this.length = length;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.bend = bend;

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
    this.width = this.height * 0.7; 

    this.plane.scale.x = this.width;
    this.plane.scale.y = this.height;

    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

    const padding = this.viewport.width * 0.1;
    this.widthTotal = (this.width + padding) * this.length;
    this.x = (this.width + padding) * this.index;
  }

  update(scroll: {current: number, last: number}, direction: 'left' | 'right') {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width; // Use full viewport width for bend calculation base
    const B_abs = Math.abs(this.bend);

    if (B_abs > 0) {
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    } else {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    }


    this.speed = scroll.current - scroll.last;

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
  items: { type: 'image' | 'video'; src: string; link: string, profile: string, caption: string }[];
  bend: number;
}

const InstaPostOverlay = () => (
    <div className="absolute inset-0 p-4 flex flex-col pointer-events-none text-white">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5">
              <div className="bg-black p-0.5 rounded-full">
                <img src="https://picsum.photos/seed/kddlogo/40/40" alt="profile" className="rounded-full" />
              </div>
            </div>
            <p className="font-bold text-sm">kopiduadarjat</p>
        </div>
        <div className="mt-auto">
            <p className="text-sm line-clamp-2">
                The perfect blend of tradition and modern craft. ✨ #KopiDuaDarjat #AntaraWarisanArtisan
            </p>
        </div>
    </div>
)


const InstaSyncClient: React.FC<InstaSyncProps> = ({ items, bend }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const { elements, scroll, getActiveIndex } = useWebGL(containerRef, items, bend);

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
    }
  }, [isCenterVideo, elements, activeIndex]);
  
  useEffect(() => {
    if (!scroll || !scroll.current || !elements.current.length || isPaused) return;

    let timeoutId: NodeJS.Timeout;
    const medias = (containerRef.current as any)?.medias; // Access medias from the App instance
    if (!medias) return;

    const advance = () => {
      const nextIndex = (activeIndex + 1) % elements.current.length;
      const mediaWidth = (medias[0]?.width || 0) + (medias[0]?.viewport.width * 0.1);
      if (scroll && scroll.current) {
         scroll.current.target = nextIndex * mediaWidth;
      }
    };

    const currentElement = elements.current[activeIndex];
    
    if (currentElement?.tagName === 'VIDEO') {
      const video = currentElement as HTMLVideoElement;
      const onEnded = () => {
        advance();
        video.removeEventListener('ended', onEnded);
      };
      video.addEventListener('ended', onEnded);

      const playPromise = video.play();
      if(playPromise !== undefined) {
        playPromise.catch(() => {});
      }
      return () => video.removeEventListener('ended', onEnded);
    } else {
      timeoutId = setTimeout(advance, 5000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeIndex, elements, scroll, isPaused, containerRef]);

  useEffect(() => {
    elements.current.forEach((el, idx) => {
      if (el?.tagName === 'VIDEO') {
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
  
  useEffect(() => {
    if (isCenterVideo && elements.current[activeIndex] instanceof HTMLVideoElement) {
      const video = elements.current[activeIndex] as HTMLVideoElement;
      setIsMuted(video.muted);
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
      <div
        className="relative w-full h-[60vh] group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div ref={containerRef} className="absolute inset-0" />
        <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 cursor-pointer">
            <div className="relative h-full w-full max-w-sm mx-auto">
                 <InstaPostOverlay/>

                {isCenterVideo && (
                <button 
                    onClick={(e) => {
                        e.preventDefault(); 
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
                    togglePause();
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-4 bg-black/50 rounded-full text-white pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    {isPaused ? <Play size={32} /> : <Pause size={32} />}
                </button>
            </div>
        </Link>
      </div>
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


const useWebGL = (
  containerRef: React.RefObject<HTMLDivElement>,
  items: InstaSyncProps['items'],
  bend: number
) => {
  const elements = useRef<(HTMLImageElement | HTMLVideoElement)[]>([]);
  const scroll = useRef<{ target: number, current: number, last: number, ease: number }>({ target: 0, current: 0, last: 0, ease: 0.05 });

  const getActiveIndex = useCallback(() => {
    if (!containerRef.current || !(containerRef.current as any).medias || !(containerRef.current as any).medias.length) return 0;
    const medias = (containerRef.current as any).medias;
    const mediaWidth = (medias[0].width || 0) + (medias[0].viewport.width * 0.1);
    return Math.round(Math.abs(scroll.current.target) / mediaWidth) % items.length;
  }, [items.length]);

  useEffect(() => {
    if (!containerRef.current || !items.length) return;

    let app: any;

    const init = async () => {
        const renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 2) });
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);
        containerRef.current!.appendChild(gl.canvas as HTMLCanvasElement);

        const camera = new Camera(gl);
        camera.fov = 45;
        camera.position.z = 20;

        const scene = new Transform();
        const planeGeometry = new Plane(gl, { heightSegments: 10, widthSegments: 10 });
        
        elements.current = items.map(item => {
            if(item.type === 'video') {
                const video = document.createElement('video');
                video.src = item.src;
                video.crossOrigin = 'anonymous';
                video.muted = true;
                video.loop = false;
                video.playsInline = true;
                return video;
            } else {
                const img = new Image();
                img.src = item.src;
                img.crossOrigin = 'anonymous';
                return img;
            }
        });
        
        await Promise.all(elements.current.map(el => new Promise(resolve => {
            if (el instanceof HTMLImageElement) el.onload = resolve;
            else if (el instanceof HTMLVideoElement) el.onloadeddata = resolve;
            else resolve(true);
        })));
        
        const duplicatedItems = [...elements.current, ...elements.current];
        const medias = duplicatedItems.map((el, i) => new Media({
            element: el,
            geometry: planeGeometry,
            gl: gl,
            index: i,
            length: duplicatedItems.length,
            scene: scene,
            screen: {width: 0, height: 0},
            viewport: {width: 0, height: 0},
            bend: bend,
        }));
        
        (containerRef.current as any).medias = medias;

        let screen = { width: 0, height: 0};
        let viewport = { width: 0, height: 0};

        const handleResize = () => {
            if (!containerRef.current) return;
            screen = {
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight,
            };
            renderer.setSize(screen.width, screen.height);
            camera.perspective({ aspect: screen.width / screen.height });
            const fov = (camera.fov * Math.PI) / 180;
            const height = 2 * Math.tan(fov / 2) * camera.position.z;
            const width = height * camera.aspect;
            viewport = { width, height };

            medias.forEach(media => media.onResize({ screen, viewport }));
        };
        handleResize();

        let isDown = false;
        let start = 0;
        let position = 0;

        const onTouchDown = (e: MouseEvent | TouchEvent) => {
            isDown = true;
            position = scroll.current.current;
            start = 'touches' in e ? e.touches[0].clientX : e.clientX;
        };
        const onTouchMove = (e: MouseEvent | TouchEvent) => {
            if (!isDown) return;
            const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const distance = (start - x) * 2;
            scroll.current.target = position + distance;
        };
        const onTouchUp = () => {
            isDown = false;
            if (!medias.length) return;
            const mediaWidth = (medias[0].width || 0) + (medias[0].viewport.width * 0.1);
            const itemIndex = Math.round(Math.abs(scroll.current.target) / mediaWidth);
            scroll.current.target = itemIndex * mediaWidth;
        };

        window.addEventListener('resize', handleResize);
        containerRef.current.addEventListener('mousedown', onTouchDown);
        window.addEventListener('mousemove', onTouchMove);
        window.addEventListener('mouseup', onTouchUp);
        containerRef.current.addEventListener('touchstart', onTouchDown);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchUp);

        let rafId: number;
        const update = () => {
          scroll.current.current = lerp(scroll.current.current, scroll.current.target, scroll.current.ease);
          const direction = scroll.current.current > scroll.current.last ? 'right' : 'left';
          medias.forEach(media => media.update(scroll.current, direction));
          renderer.render({ scene, camera });
          scroll.current.last = scroll.current.current;
          rafId = requestAnimationFrame(update);
        };
        update();

        app = {
            destroy: () => {
                window.removeEventListener('resize', handleResize);
                containerRef.current?.removeEventListener('mousedown', onTouchDown);
                window.removeEventListener('mousemove', onTouchMove);
                window.removeEventListener('mouseup', onTouchUp);
                containerRef.current?.removeEventListener('touchstart', onTouchDown);
                window.removeEventListener('touchmove', onTouchMove);
                window.removeEventListener('touchend', onTouchUp);
                cancelAnimationFrame(rafId);
                containerRef.current?.removeChild(gl.canvas as Node);
            }
        }
    };
    init();

    return () => {
      app?.destroy();
    };
  }, [items, bend]);

  return { elements, scroll, getActiveIndex };
};

export default function InstaSync() {

  const videos = [
      "https://cdn.pixabay.com/video/2024/04/25/209419_large.mp4",
      "https://cdn.pixabay.com/video/2024/04/25/209424_large.mp4",
      "https://cdn.pixabay.com/video/2020/08/12/46989-449623829_large.mp4",
  ];
  
  const images = [
    "https://picsum.photos/seed/insta1/800/1000",
    "https://picsum.photos/seed/insta2/800/1000",
    "https://picsum.photos/seed/insta3/800/1000",
  ];

  const mixedItems = [
    { type: 'video' as const, src: videos[0], link: '#', profile: 'kopiduadarjat', caption: 'Morning brews.'},
    { type: 'image' as const, src: images[0], link: '#', profile: 'kopiduadarjat', caption: 'Our new outlet!'},
    { type: 'video' as const, src: videos[1], link: '#', profile: 'kopiduadarjat', caption: 'Behind the scenes.'},
    { type: 'image' as const, src: images[1], link: '#', profile: 'kopiduadarjat', caption: 'Sunday vibes.'},
    { type: 'video' as const, src: videos[2], link: '#', profile: 'kopiduadarjat', caption: 'The perfect pour.'},
    { type: 'image' as const, src: images[2], link: '#', profile: 'kopiduadarjat', caption: 'Community day!'},
    { type: 'video' as const, src: videos[0], link: '#', profile: 'kopiduadarjat', caption: 'Come say hi!'},
    { type: 'image' as const, src: images[0], link: '#', profile: 'kopiduadarjat', caption: 'What a view.'},
  ];

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-12">
        <InstaSyncClient items={mixedItems} bend={3}/>
      </div>
    </section>
  );
}

