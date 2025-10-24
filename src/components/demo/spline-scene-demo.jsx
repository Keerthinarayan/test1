import { SplineScene } from "@/components/ui/spline-scene";
import { Card } from "@/components/ui/card";
import { SpotlightAceternity } from "@/components/ui/spotlight-aceternity";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Sparkles, Zap } from "lucide-react";

/**
 * Spline Scene Demo Component with Full Animations
 * 
 * Features:
 * - Spline 3D animated scene
 * - Aceternity spotlight effect
 * - Gradient text animations
 * - Card shimmer effect
 * - Button glow effects
 */
export function SplineSceneDemo() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden border-zinc-800 card-shimmer">
      {/* Aceternity Spotlight Effect */}
      <SpotlightAceternity
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content with animations */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          {/* Animated badge */}
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Interactive 3D
            </span>
          </div>
          
          {/* Animated gradient title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Beautiful
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-success to-primary bg-clip-text text-transparent animate-gradient-text bg-[length:200%_auto]">
              3D Experiences
            </span>
          </h1>
          
          <p className="mt-4 text-neutral-300 max-w-lg mb-8 leading-relaxed">
            Bring your UI to life with beautiful 3D scenes. Create immersive experiences 
            that capture attention and enhance your design with interactive animations.
          </p>

          {/* Animated buttons */}
          <div className="flex gap-4">
            <AnimatedButton 
              className="bg-gradient-to-r from-primary to-success pulse-glow"
            >
              <Zap className="w-4 h-4 mr-2" />
              Explore Now
            </AnimatedButton>
            
            <AnimatedButton 
              variant="outline"
              className="border-zinc-700 hover:border-zinc-600 transition-all"
            >
              Learn More
            </AnimatedButton>
          </div>
        </div>

        {/* Right content - 3D Scene with gradient overlay */}
        <div className="flex-1 relative">
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black/60 z-[1] pointer-events-none" />
          
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
}
