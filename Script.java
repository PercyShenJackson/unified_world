
public class Script {

    public static class PhysicsResult {

        public double finalVelocity;
        public double displacement;
        public double kineticEnergy;

        public PhysicsResult(
            double velocity,
            double acceleration,
            double time,
            double mass
        ) {

            finalVelocity = velocity + acceleration * time;

            displacement =
                velocity * time
                + 0.5 * acceleration * time * time;

            kineticEnergy =
                0.5 * mass * finalVelocity * finalVelocity;
        }

        public void display() {

            System.out.println("\n--- PHYSICS LAB ---");

            System.out.printf(
                "Final Velocity: %.2f m/s%n",
                finalVelocity
            );

            System.out.printf(
                "Displacement: %.2f m%n",
                displacement
            );

            System.out.printf(
                "Kinetic Energy: %.2f Joules%n",
                kineticEnergy
            );
        }
    }

    public static void main(String[] args) {

        System.out.println("==============================");
        System.out.println("     UNIFIED WORLD");
        System.out.println("       PHYSICS LAB");
        System.out.println("==============================");

        double velocity = 0;
        double acceleration = 9.8;
        double time = 5;
        double mass = 2;

        PhysicsResult simulation = new PhysicsResult(
            velocity,
            acceleration,
            time,
            mass
        );

        simulation.display();

        System.out.println("\nSimulation completed.");
    }
}
