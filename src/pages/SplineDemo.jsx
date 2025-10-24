import { SplineSceneDemo } from "@/components/demo/spline-scene-demo";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const SplineDemo = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Spline 3D Scene Demo
          </h1>
          <p className="text-xl text-muted-foreground">
            Interactive 3D scenes powered by Spline and React
          </p>
        </div>

        <SplineSceneDemo />

        <div className="mt-12 p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Implementation Details</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>✅ Lazy loading with React Suspense for optimal performance</p>
            <p>✅ Spotlight effect with SVG animations</p>
            <p>✅ Responsive layout (flexbox for mobile/desktop)</p>
            <p>✅ Dark theme optimized design</p>
            <p>✅ Smooth loading spinner fallback</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplineDemo;
