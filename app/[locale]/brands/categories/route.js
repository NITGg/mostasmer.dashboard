import express from 'express';
import prisma from '../../../prisma/client.js';
import authorization from '../../../middleware/authorization.js';
import getTranslation from '../../../middleware/getTranslation.js';
import { z } from 'zod';

const router = express.Router();

// Schema for validating category assignments
const brandCategorySchema = (lang) => {
    return z.object({
        categoryIds: z.array(z.number(), {
            required_error: getTranslation(lang, 'categories_required'),
            invalid_type_error: getTranslation(lang, 'categories_must_be_array')
        }).min(1, { message: getTranslation(lang, 'at_least_one_category') })
    });
};

// Get categories for a specific brand
router.get('/:brandId', async (req, res) => {
    const { brandId } = req.params;
    const lang = req.query.lang || 'en';

    try {
        const brandCategories = await prisma.brandCategory.findMany({
            where: { brandId: parseInt(brandId) },
            include: {
                category: true
            }
        });

        const categories = brandCategories.map(bc => ({
            ...bc.category,
            name: extractLanguageContent(bc.category.name, lang)
        }));

        res.status(200).json({ categories });
    } catch (error) {
        console.error(error);
        res.status(400).json({ 
            message: getTranslation(lang, 'internalError'), 
            error: error.message 
        });
    }
});

// Assign categories to a brand
router.post('/:brandId', authorization, express.json({ type: '*/*' }), async (req, res) => {
    const { brandId } = req.params;
    const lang = req.query.lang || 'en';

    try {
        // Debug logging
        console.log('Received request for brand:', brandId);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Request body:', req.body);

        const admin = req.user;
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ 
                message: getTranslation(lang, 'not_allowed') 
            });
        }

        // Ensure we have a valid body
        if (!req.body || !req.body.categoryIds) {
            return res.status(400).json({
                message: 'Missing categoryIds in request body',
                receivedBody: req.body
            });
        }

        const validation = brandCategorySchema(lang).safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Invalid request data',
                errors: validation.error.errors,
                receivedBody: req.body
            });
        }

        const { categoryIds } = validation.data;

        // Validate brand exists
        const brand = await prisma.brand.findUnique({
            where: { id: parseInt(brandId) }
        });

        if (!brand) {
            return res.status(404).json({
                message: getTranslation(lang, 'brand_not_found')
            });
        }

        // Validate that all categoryIds exist
        const existingCategories = await prisma.category.findMany({
            where: {
                id: {
                    in: categoryIds
                }
            }
        });

        if (existingCategories.length !== categoryIds.length) {
            return res.status(400).json({
                message: getTranslation(lang, 'invalid_categories')
            });
        }

        // Delete existing category assignments
        await prisma.brandCategory.deleteMany({
            where: { brandId: parseInt(brandId) }
        });

        // Create new category assignments
        const brandCategories = await prisma.brandCategory.createMany({
            data: categoryIds.map(categoryId => ({
                brandId: parseInt(brandId),
                categoryId
            }))
        });

        res.status(200).json({ 
            message: getTranslation(lang, 'categories_assigned'),
            count: brandCategories.count
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(400).json({ 
            message: getTranslation(lang, 'internalError'), 
            error: error.message
        });
    }
});

// Remove a specific category from a brand
router.delete('/:brandId/:categoryId', authorization, async (req, res) => {
    const { brandId, categoryId } = req.params;
    const lang = req.query.lang || 'en';

    try {
        const admin = req.user;
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ 
                message: getTranslation(lang, 'not_allowed') 
            });
        }

        await prisma.brandCategory.delete({
            where: {
                brandId_categoryId: {
                    brandId: parseInt(brandId),
                    categoryId: parseInt(categoryId)
                }
            }
        });

        res.status(200).json({ 
            message: getTranslation(lang, 'category_removed_from_brand') 
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ 
            message: getTranslation(lang, 'internalError'), 
            error: error.message 
        });
    }
});

// Helper function to extract language content
function extractLanguageContent(text, lang) {
    if (!text) return '';
    
    const regex = new RegExp(`{mlang ${lang}}(.*?){mlang}`, 'i');
    const match = text.match(regex);
    
    if (match && match[1]) {
        return match[1].trim();
    }
    
    if (lang !== 'en') {
        const enMatch = text.match(/{mlang en}(.*?){mlang}/i);
        if (enMatch && enMatch[1]) {
            return enMatch[1].trim();
        }
    }
    
    return text.includes('{mlang') ? '' : text.trim();
}

export default router; 