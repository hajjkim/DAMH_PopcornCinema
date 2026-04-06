/**
 * Migration script to add bookingCodes to existing bookings
 * Run with: npx ts-node migrate-booking-codes.ts
 */

import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { Booking } from "./schemas/booking.schema";
import { generateOrderCode } from "./utils/generate-code";

async function migrateBookingCodes() {
  try {
    console.log("🚀 Starting booking code migration...");
    
    // Connect to database
    await connectDB();
    console.log("✅ Connected to database");

    // Find all bookings without bookingCode
    const bookingsWithoutCode = await Booking.find({ 
      $or: [
        { bookingCode: { $exists: false } },
        { bookingCode: null },
        { bookingCode: "" }
      ]
    });

    console.log(`📋 Found ${bookingsWithoutCode.length} bookings without codes`);

    if (bookingsWithoutCode.length === 0) {
      console.log("✅ All bookings already have codes!");
      await mongoose.connection.close();
      return;
    }

    // Generate unique codes for each
    let updated = 0;
    let failed = 0;

    for (const booking of bookingsWithoutCode) {
      try {
        let bookingCode = generateOrderCode();
        let retries = 0;
        
        // Check for collision and retry if needed
        while (retries < 5) {
          const existing = await Booking.findOne({ bookingCode }).lean();
          if (!existing) {
            break;
          }
          bookingCode = generateOrderCode();
          retries++;
        }

        if (retries >= 5) {
          console.error(`❌ Failed to generate unique code for booking ${booking._id}`);
          failed++;
          continue;
        }

        // Update the booking
        await Booking.findByIdAndUpdate(booking._id, { bookingCode }, { new: true });
        updated++;
        console.log(`✅ Updated booking ${booking._id} → ${bookingCode}`);
      } catch (err) {
        console.error(`❌ Error updating booking ${booking._id}:`, err);
        failed++;
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📈 Total: ${updated + failed}`);

    await mongoose.connection.close();
    console.log("✅ Migration complete!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrateBookingCodes();
