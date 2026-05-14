import fs from 'fs';

let code = fs.readFileSync('index.js', 'utf8');
code = code.replace(/app\.listen[\s\S]*\}\);/, '');
code += `
(async () => {
  try {
    const jd = "Job Title: Graphic Designer\\n\\nJob Summary:\\nWe are looking for a creative and talented Graphic Designer to join our team. The Graphic Designer will create visually appealing designs for digital and print media, including social media posts, websites, advertisements, presentations, logos, and marketing materials. The candidate should have a good understanding of design principles, creativity, and branding.\\n\\nKey Responsibilities:\\n- Design and produce marketing materials";
    const res = await processEmails('test_user', jd);
    console.log("FINAL RESULT:", JSON.stringify(res, null, 2));
  } catch(e) {
    console.error("CRASH:", e);
  }
})();
`;
fs.writeFileSync('temp_index.js', code);
