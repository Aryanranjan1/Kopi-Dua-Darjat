

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import { ai } from '@/ai/genkit';
import { z } from 'zod';

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const syncInstagramPosts = async () => {
  try