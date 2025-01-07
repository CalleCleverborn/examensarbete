import mongoose from 'mongoose';
import Plan from "../../models/Plan";

export async function seedPlans() {
    const count = await Plan.countDocuments();
    if (count === 0) {
        await Plan.insertMany([
            {
                name: "Base",
                price: 0,
                conversionsPerMonth: 5,
                voiceModelLimit: 16,
                downloadTime: 10,
                description: "For hobby use",
                bulletPoints: [
                    "5 conversions per month",
                    "16 voice models",
                    "10 minutes download time",
                    "Wav download format"
                ]
            },
            {
                name: "Premium",
                price: 12.99,
                conversionsPerMonth: 100,
                voiceModelLimit: 99999,
                downloadTime: 60,
                description: "For more professional use",
                bulletPoints: [
                    "100 conversions per month",
                    "Access Every Voice Model",
                    "60 minutes download time",
                    "Wav download format"
                ]
            },
            {
                name: "Enterprise",
                price: 29.99,
                conversionsPerMonth: 99999,
                voiceModelLimit: 99999,
                downloadTime: 99999,
                description: "For studio grade creation",
                bulletPoints: [
                    "Unlimited conversions",
                    "Access Every Voice Model",
                    "Unlimited download time",
                    "Wav download format"
                ]
            }
        ]);
        console.log("Plans seeded successfully.");
    } else {
        console.log("Plans already exist. Skipping seeding.");
    }
}
