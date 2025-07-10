-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
    avatar TEXT,
    staff_code VARCHAR(100) UNIQUE,
    department VARCHAR(100),
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    payment_method VARCHAR(100),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    payment_method VARCHAR(100),
    payment_reference VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff members table
CREATE TABLE staff_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    staff_code VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    points INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES users(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    room_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals table
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    referral_category VARCHAR(100),
    referral_code VARCHAR(100) UNIQUE,
    motivation TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    earnings DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service bookings table
CREATE TABLE service_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL,
    preferred_date DATE,
    preferred_time TIME,
    client_info JSONB,
    project_details TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace designs table
CREATE TABLE marketplace_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    image TEXT,
    files JSONB,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Charging stations table
CREATE TABLE charging_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
    capacity VARCHAR(50),
    connectors JSONB,
    price_per_kwh DECIMAL(10, 2),
    availability INTEGER DEFAULT 0,
    total_slots INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Charging sessions table
CREATE TABLE charging_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    station_id UUID REFERENCES charging_stations(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    energy_consumed DECIMAL(10, 2),
    cost DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor VARCHAR(255),
    duration VARCHAR(100),
    level VARCHAR(50) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    price DECIMAL(10, 2) DEFAULT 0,
    image TEXT,
    content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    completed_lessons JSONB,
    quiz_scores JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_staff_code ON users(staff_code);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_service_bookings_user_id ON service_bookings(user_id);
CREATE INDEX idx_charging_stations_location ON charging_stations(location);

-- Create RLS policies for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE charging_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE charging_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be customized based on specific needs)
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Users can view their own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample data
INSERT INTO products (name, description, price, category, image) VALUES
    ('Solar Panel 300W', 'High-efficiency solar panel for residential use', 150000, 'Solar', '/images/solar-panel.jpg'),
    ('LED Bulb 12W', 'Energy-efficient LED bulb with 10-year warranty', 2500, 'LED', '/images/led-bulb.jpg'),
    ('Smart Inverter 5kW', 'Intelligent solar inverter with monitoring', 450000, 'Inverter', '/images/inverter.jpg'),
    ('Battery Pack 200Ah', 'Deep cycle battery for energy storage', 180000, 'Battery', '/images/battery.jpg');

INSERT INTO charging_stations (name, location, latitude, longitude, capacity, connectors, price_per_kwh, availability, total_slots) VALUES
    ('Zavolah Solar Station - VI', 'Victoria Island, Lagos', 6.4281, 3.4219, '150kW', '["Type 2", "CCS", "CHAdeMO"]', 50, 8, 10),
    ('Zavolah Green Hub - Ikeja', 'Ikeja, Lagos', 6.5244, 3.3792, '100kW', '["Type 2", "CCS"]', 45, 2, 6),
    ('Zavolah Express - Lekki', 'Lekki Peninsula, Lagos', 6.4698, 3.5852, '200kW', '["Type 2", "CCS", "CHAdeMO", "Tesla"]', 60, 5, 8);

INSERT INTO courses (title, description, instructor, duration, level, price, image) VALUES
    ('Solar Energy Basics', 'Introduction to solar energy systems and installation', 'Dr. Adebayo Ogunleye', '4 weeks', 'beginner', 25000, '/images/solar-course.jpg'),
    ('Advanced Battery Systems', 'Deep dive into energy storage technologies', 'Eng. Fatima Mohammed', '6 weeks', 'advanced', 45000, '/images/battery-course.jpg'),
    ('Smart Grid Integration', 'Learn about modern grid systems and renewable integration', 'Prof. Chidi Okwu', '8 weeks', 'intermediate', 35000, '/images/grid-course.jpg');
