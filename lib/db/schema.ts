import { getDbPool } from "@/lib/db/neon";

declare global {
  // eslint-disable-next-line no-var
  var __icepSchemaInitPromise: Promise<void> | undefined;
}

async function createSchema() {
  const pool = getDbPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS article_sections (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      code TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS article_types (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      section_id INTEGER NOT NULL REFERENCES article_sections(id) ON DELETE CASCADE,
      UNIQUE(section_id, code),
      UNIQUE(section_id, name)
    );

    CREATE TABLE IF NOT EXISTS blog_categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS project_categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS project_styles (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category_id INTEGER REFERENCES project_categories(id),
      style_id INTEGER REFERENCES project_styles(id),
      style TEXT NOT NULL,
      budget TEXT NOT NULL,
      cover_image_url TEXT NOT NULL DEFAULT '',
      cover_image_alt TEXT NOT NULL DEFAULT '',
      cover_image_blur_data_url TEXT,
      word_content TEXT,
      featured BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE projects ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES project_categories(id);
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS style_id INTEGER REFERENCES project_styles(id);

    CREATE TABLE IF NOT EXISTS project_attributes (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      attr_key TEXT NOT NULL,
      attr_value TEXT NOT NULL,
      label TEXT
    );

    CREATE TABLE IF NOT EXISTS project_sections (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT,
      image_url TEXT,
      image_alt TEXT,
      position INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS project_images (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      alt TEXT NOT NULL DEFAULT '',
      blur_data_url TEXT,
      position INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS project_highlights (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      position INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      category_id INTEGER REFERENCES blog_categories(id),
      content TEXT NOT NULL,
      cover_image_url TEXT NOT NULL DEFAULT '',
      published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES blog_categories(id);

    CREATE TABLE IF NOT EXISTS project_articles (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE,
      section_id INTEGER REFERENCES article_sections(id),
      type_id INTEGER REFERENCES article_types(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      cover_image_url TEXT NOT NULL,
      intro_content TEXT NOT NULL,
      main_content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE project_articles ADD COLUMN IF NOT EXISTS section_id INTEGER REFERENCES article_sections(id);
    ALTER TABLE project_articles ADD COLUMN IF NOT EXISTS type_id INTEGER REFERENCES article_types(id);

    CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_section_type ON project_articles(section_id, type_id) WHERE section_id IS NOT NULL AND type_id IS NOT NULL;

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='project_articles' AND column_name='target_section'
      ) THEN
        INSERT INTO article_sections (name, code)
        SELECT DISTINCT
          CASE target_section::text
            WHEN 'thiet-ke-noi-that' THEN 'Thiết kế nội thất'
            WHEN 'thi-cong-noi-that' THEN 'Thi công nội thất'
            ELSE target_section::text
          END,
          target_section::text
        FROM project_articles
        WHERE target_section IS NOT NULL
        ON CONFLICT (code) DO NOTHING;

        INSERT INTO article_types (name, code, section_id)
        SELECT DISTINCT
          INITCAP(REPLACE(pa.target_type, '-', ' ')),
          pa.target_type,
          s.id
        FROM project_articles pa
        JOIN article_sections s ON s.code = pa.target_section::text
        WHERE pa.target_type IS NOT NULL
        ON CONFLICT (section_id, code) DO NOTHING;

        UPDATE project_articles pa
        SET section_id = s.id
        FROM article_sections s
        WHERE pa.section_id IS NULL AND pa.target_section::text = s.code;

        UPDATE project_articles pa
        SET type_id = t.id
        FROM article_types t
        JOIN article_sections s ON s.id = t.section_id
        WHERE pa.type_id IS NULL
          AND pa.section_id = s.id
          AND pa.target_type = t.code;
      END IF;
    END$$;

    INSERT INTO article_sections (name, code)
    VALUES
      ('Thiết kế nội thất', 'thiet-ke-noi-that'),
      ('Thi công nội thất', 'thi-cong-noi-that')
    ON CONFLICT (code) DO NOTHING;

    INSERT INTO article_types (name, code, section_id)
    SELECT v.name, v.code, s.id
    FROM (
      VALUES
        ('Thiết kế nội thất biệt thự', 'biet-thu', 'thiet-ke-noi-that'),
        ('Thiết kế nội thất chung cư', 'chung-cu', 'thiet-ke-noi-that'),
        ('Thiết kế nội thất nhà phố', 'nha-pho', 'thiet-ke-noi-that'),
        ('Thiết kế nội thất penthouse, duplex', 'penthouse', 'thiet-ke-noi-that'),
        ('Thiết kế nội thất văn phòng', 'van-phong', 'thiet-ke-noi-that'),
        ('Thiết kế nội thất khách sạn', 'khach-san', 'thiet-ke-noi-that'),
        ('Thiết kế nội thất nhà hàng', 'nha-hang', 'thiet-ke-noi-that'),
        ('Thiết kế nội thất quán cafe', 'cafe', 'thiet-ke-noi-that'),
        ('Thiết kế nội thất showroom', 'showroom', 'thiet-ke-noi-that'),
        ('Thi công nội thất biệt thự', 'biet-thu', 'thi-cong-noi-that'),
        ('Thi công nội thất chung cư', 'chung-cu', 'thi-cong-noi-that'),
        ('Thi công nội thất nhà phố', 'nha-pho', 'thi-cong-noi-that'),
        ('Thi công nội thất văn phòng', 'van-phong', 'thi-cong-noi-that')
    ) AS v(name, code, section_code)
    JOIN article_sections s ON s.code = v.section_code
    ON CONFLICT (section_id, code) DO NOTHING;

    INSERT INTO blog_categories (name)
    VALUES
      ('Xu hướng thiết kế'),
      ('Kinh nghiệm thi công'),
      ('Vật liệu nội thất'),
      ('Phong thủy nội thất'),
      ('Mẹo tối ưu không gian'),
      ('Báo giá và chi phí')
    ON CONFLICT (name) DO NOTHING;

    INSERT INTO project_categories (name)
    VALUES
      ('Căn hộ'),
      ('Biệt thự'),
      ('Nhà phố'),
      ('Văn phòng'),
      ('Khách sạn'),
      ('Café')
    ON CONFLICT (name) DO NOTHING;

    INSERT INTO project_styles (name)
    VALUES
      ('Hiện đại'),
      ('Tân cổ điển'),
      ('Minimalism'),
      ('Japandi'),
      ('Wabi Sabi'),
      ('Tropical'),
      ('Modern Luxury')
    ON CONFLICT (name) DO NOTHING;

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='projects' AND column_name='category'
      ) THEN
        EXECUTE '
          UPDATE projects p
          SET category_id = c.id
          FROM project_categories c
          WHERE p.category_id IS NULL
            AND c.name = p.category
        ';
      END IF;
    END$$;

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='projects' AND column_name='style'
      ) THEN
        EXECUTE '
          UPDATE projects p
          SET style_id = s.id
          FROM project_styles s
          WHERE p.style_id IS NULL
            AND LOWER(TRIM(p.style)) = LOWER(TRIM(s.name))
        ';

        EXECUTE '
          UPDATE projects p
          SET style = s.name
          FROM project_styles s
          WHERE p.style_id = s.id
        ';
      END IF;
    END$$;

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='blog_posts' AND column_name='category'
      ) THEN
        EXECUTE '
          UPDATE blog_posts bp
          SET category_id = c.id
          FROM blog_categories c
          WHERE bp.category_id IS NULL
            AND c.name = bp.category
        ';
      END IF;
    END$$;

    CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
    CREATE INDEX IF NOT EXISTS idx_projects_category_id ON projects(category_id);
    CREATE INDEX IF NOT EXISTS idx_projects_style_id ON projects(style_id);
    CREATE INDEX IF NOT EXISTS idx_projects_style ON projects(style);
    CREATE INDEX IF NOT EXISTS idx_projects_budget ON projects(budget);

    CREATE INDEX IF NOT EXISTS idx_project_attributes_project_id ON project_attributes(project_id);
    CREATE INDEX IF NOT EXISTS idx_project_sections_project_id_position ON project_sections(project_id, position);
    CREATE INDEX IF NOT EXISTS idx_project_images_project_id_position ON project_images(project_id, position);
    CREATE INDEX IF NOT EXISTS idx_project_highlights_project_id_position ON project_highlights(project_id, position);

    CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_article_types_section_id ON article_types(section_id);
    CREATE INDEX IF NOT EXISTS idx_project_articles_section_type ON project_articles(section_id, type_id);

    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
    CREATE TRIGGER trg_projects_updated_at
      BEFORE UPDATE ON projects
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();

    DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON blog_posts;
    CREATE TRIGGER trg_blog_posts_updated_at
      BEFORE UPDATE ON blog_posts
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();

    DROP TRIGGER IF EXISTS trg_project_articles_updated_at ON project_articles;
    CREATE TRIGGER trg_project_articles_updated_at
      BEFORE UPDATE ON project_articles
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  `);
}

export async function ensureDbSchema(): Promise<void> {
  if (!global.__icepSchemaInitPromise) {
    global.__icepSchemaInitPromise = createSchema();
  }

  try {
    await global.__icepSchemaInitPromise;
  } catch (error) {
    global.__icepSchemaInitPromise = undefined;
    throw error;
  }
}
