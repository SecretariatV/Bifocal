import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeInSlowly = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background-color: #14161f;
  color: white;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #60a5fa;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Section = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  backdrop-filter: blur(10px);
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ResourceCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const ResourceName = styled.h3`
  color: #60a5fa;
  margin-bottom: 0.5rem;
`;

const ResourceType = styled.p`
  color: #60a5fa;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
`;

const ResourceDescription = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ResourceContact = styled.a`
  color: #60a5fa;
  text-decoration: none;
  display: block;
  font-size: 1.1rem;
  margin-top: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const SearchSection = styled.div`
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #60a5fa;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
  }
`;

const LocationButton = styled.button`
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  &:hover {
    background: rgba(96, 165, 250, 0.2);
    border-color: rgba(96, 165, 250, 0.3);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Resources = () => {
  const [zipCode, setZipCode] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const hotlines = [
    {
      name: 'National Domestic Violence Hotline',
      phone: '1-800-799-SAFE (7233)',
      description: '24/7 confidential support for anyone experiencing domestic violence, seeking resources or information, or questioning unhealthy aspects of their relationship.'
    },
    {
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description: 'Free 24/7 support for those in crisis. Text with a trained Crisis Counselor for support with anxiety, depression, abuse, and more.'
    },
    {
      name: 'National Sexual Assault Hotline',
      phone: '1-800-656-HOPE (4673)',
      description: 'Connects you with a trained staff member from a sexual assault service provider in your area.'
    },
    {
      name: 'StrongHearts Native Helpline',
      phone: '1-844-762-8483',
      description: 'Safe, confidential, and culturally appropriate domestic, dating, and sexual violence helpline for American Indians and Alaska Natives.'
    },
    {
      name: 'National Teen Dating Abuse Helpline',
      phone: '1-866-331-9474',
      description: 'Specialized support for young people between 13 and 26 who have questions or concerns about dating relationships.'
    },
    {
      name: 'LGBTQ+ National Help Center',
      phone: '1-888-843-4564',
      description: 'Provides peer support, community connections and resource information to people with questions regarding sexual orientation and gender identity.'
    }
  ];

  const mcKinneyResources = [
    {
      name: 'Healing Path Therapy Center',
      type: 'Counseling Services',
      address: '123 Main St, McKinney, TX 75071',
      phone: '(972) 555-0123',
      description: 'Professional counseling services specializing in trauma and relationship issues.'
    },
    {
      name: 'McKinney Counseling Group',
      type: 'Counseling Services',
      address: '456 Oak Ave, McKinney, TX 75071',
      phone: '(972) 555-0456',
      description: 'Group and individual therapy sessions with experienced counselors.'
    },
    {
      name: 'Hope & Healing Support Group',
      type: 'Support Group',
      address: '789 Elm St, McKinney, TX 75071',
      phone: '(972) 555-0789',
      description: 'Weekly support groups for survivors of domestic violence.'
    },
    {
      name: 'Safe Haven Emergency Shelter',
      type: 'Emergency Shelter',
      address: '567 Cedar Ln, McKinney, TX 75071',
      phone: '(972) 555-0567',
      description: '24/7 emergency shelter providing safe accommodation and support services.'
    },
    {
      name: 'Legal Aid of McKinney',
      type: 'Legal Services',
      address: '890 Maple Dr, McKinney, TX 75071',
      phone: '(972) 555-0890',
      description: 'Free legal consultation and representation for domestic violence cases.'
    },
    {
      name: 'Victim Support Alliance',
      type: 'Advocacy Center',
      address: '432 Birch St, McKinney, TX 75071',
      phone: '(972) 555-0432',
      description: 'Comprehensive support services and advocacy for victims of abuse.'
    }
  ];

  const richardsonResources = [
    {
      name: 'Richardson Crisis Center',
      type: 'Crisis Center',
      address: '2701 Custer Pkwy, Richardson, TX 75080',
      phone: '(972) 555-1234',
      description: '24/7 crisis intervention and emergency services for individuals in immediate need.'
    },
    {
      name: 'Harmony Counseling Center',
      type: 'Counseling Services',
      address: '1200 E Campbell Rd, Richardson, TX 75080',
      phone: '(972) 555-5678',
      description: 'Individual and family counseling with trauma-informed therapists.'
    },
    {
      name: "Richardson Women's Center",
      type: 'Support Services',
      address: '400 W Arapaho Rd, Richardson, TX 75080',
      phone: '(972) 555-9012',
      description: 'Comprehensive support services including counseling, legal advocacy, and support groups.'
    },
    {
      name: 'Safe Space Emergency Housing',
      type: 'Emergency Shelter',
      address: '300 N Grove Rd, Richardson, TX 75080',
      phone: '(972) 555-3456',
      description: 'Secure emergency housing with 24/7 staff support and crisis intervention.'
    },
    {
      name: 'Richardson Legal Aid Society',
      type: 'Legal Services',
      address: '1500 E Spring Valley Rd, Richardson, TX 75080',
      phone: '(972) 555-7890',
      description: 'Pro bono legal services for domestic violence survivors, including protective orders and family law.'
    },
    {
      name: 'Hope House Support Group',
      type: 'Support Group',
      address: '850 W Campbell Rd, Richardson, TX 75080',
      phone: '(972) 555-4321',
      description: 'Peer-led support groups for survivors of domestic violence and abuse.'
    }
  ];

  const prosperResources = [
    {
      name: 'Prosper Family Crisis Center',
      type: 'Crisis Center',
      address: '1100 S Preston Rd, Prosper, TX 75078',
      phone: '(469) 555-0123',
      description: 'Immediate crisis intervention and family support services available 24/7.'
    },
    {
      name: 'Healing Hearts Counseling',
      type: 'Counseling Services',
      address: '200 E First St, Prosper, TX 75078',
      phone: '(469) 555-4567',
      description: 'Specialized trauma counseling and mental health support for individuals and families.'
    },
    {
      name: 'Prosper Community Support',
      type: 'Support Services',
      address: '300 E Broadway St, Prosper, TX 75078',
      phone: '(469) 555-8901',
      description: 'Comprehensive community support including counseling, advocacy, and emergency assistance.'
    },
    {
      name: 'Safe Harbor Shelter',
      type: 'Emergency Shelter',
      address: '450 N Coleman St, Prosper, TX 75078',
      phone: '(469) 555-2345',
      description: 'Emergency shelter services with 24-hour security and support staff.'
    },
    {
      name: 'Prosper Legal Advocates',
      type: 'Legal Services',
      address: '750 W University Dr, Prosper, TX 75078',
      phone: '(469) 555-6789',
      description: 'Free legal assistance for domestic violence survivors, including court advocacy.'
    },
    {
      name: 'Survivors United',
      type: 'Support Group',
      address: '600 E Frontier Pkwy, Prosper, TX 75078',
      phone: '(469) 555-0987',
      description: 'Weekly support groups and peer counseling for survivors of domestic violence.'
    }
  ];

  const planoResources = [
    {
      name: 'Plano Crisis Support Center',
      type: 'Crisis Center',
      address: '2600 K Ave, Plano, TX 75075',
      phone: '(972) 555-7123',
      description: 'Immediate crisis intervention and support services available 24/7 with trained counselors.'
    },
    {
      name: 'Hope & Healing Counseling',
      type: 'Counseling Services',
      address: '1517 15th St, Plano, TX 75075',
      phone: '(972) 555-7456',
      description: 'Professional trauma-informed counseling services with specialized domestic violence support.'
    },
    {
      name: 'Plano Family Support Center',
      type: 'Support Services',
      address: '1000 E Park Blvd, Plano, TX 75075',
      phone: '(972) 555-7890',
      description: 'Comprehensive family support including case management, counseling, and emergency assistance.'
    },
    {
      name: 'Safe Harbor House',
      type: 'Emergency Shelter',
      address: '3000 Custer Rd, Plano, TX 75075',
      phone: '(972) 555-7234',
      description: "Secure emergency shelter with 24/7 security, support services, and children's programs."
    },
    {
      name: 'Plano Legal Assistance Network',
      type: 'Legal Services',
      address: '900 E 16th St, Plano, TX 75075',
      phone: '(972) 555-7567',
      description: 'Free legal aid for domestic violence survivors, including protective orders and family law.'
    },
    {
      name: 'Healing Together',
      type: 'Support Group',
      address: '1400 Summit Ave, Plano, TX 75075',
      phone: '(972) 555-7789',
      description: 'Weekly support groups for survivors, including specialized groups for teens and LGBTQ+ individuals.'
    }
  ];

  const cerritosResources = [
    {
      name: 'Cerritos Family Resource Center',
      type: 'Crisis Center',
      address: '18700 Bloomfield Ave, Cerritos, CA 90703',
      phone: '(562) 555-0123',
      description: 'Comprehensive family support services and crisis intervention available 24/7.'
    },
    {
      name: 'Harmony Wellness Center',
      type: 'Counseling Services',
      address: '11900 South St, Cerritos, CA 90703',
      phone: '(562) 555-4567',
      description: 'Professional counseling services specializing in trauma-informed care and family therapy.'
    },
    {
      name: "Cerritos Women's Resource Center",
      type: 'Support Services',
      address: '12700 Center Court Dr, Cerritos, CA 90703',
      phone: '(562) 555-8901',
      description: 'Support services for women including counseling, career resources, and domestic violence support.'
    },
    {
      name: 'Safe Haven Emergency Housing',
      type: 'Emergency Shelter',
      address: '17600 Gridley Rd, Cerritos, CA 90703',
      phone: '(562) 555-2345',
      description: 'Secure temporary housing with comprehensive support services and 24/7 staff.'
    },
    {
      name: 'Cerritos Legal Aid Center',
      type: 'Legal Services',
      address: '10900 183rd St, Cerritos, CA 90703',
      phone: '(562) 555-6789',
      description: 'Free legal assistance including restraining orders, family law, and immigration services.'
    },
    {
      name: 'Survivors Support Network',
      type: 'Support Group',
      address: '13200 166th St, Cerritos, CA 90703',
      phone: '(562) 555-0987',
      description: 'Peer support groups and counseling for survivors of domestic violence and abuse.'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode === '75071' || zipCode === '75080' || zipCode === '75078' || zipCode === '75075' || zipCode === '90703') {
      setShowResults(true);
    }
  };

  const getResourcesForZip = () => {
    switch (zipCode) {
      case '75071':
        return mcKinneyResources;
      case '75080':
        return richardsonResources;
      case '75078':
        return prosperResources;
      case '90703':
        return cerritosResources;
      case '75075':
        return planoResources;
      default:
        return [];
    }
  };

  const getCityName = () => {
    switch (zipCode) {
      case '75071':
        return 'McKinney';
      case '75080':
        return 'Richardson';
      case '75078':
        return 'Prosper';
      case '90703':
        return 'Cerritos';
      case '75075':
        return 'Plano';
      default:
        return '';
    }
  };

  const handleFindMe = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Using reverse geocoding to get ZIP code
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            const foundZip = data.address?.postcode;
            
            if (foundZip) {
              setZipCode(foundZip);
              if (['75071', '75080', '75078', '90703', '75075'].includes(foundZip)) {
                setShowResults(true);
              }
            }
          } catch (error) {
            console.error('Error getting location:', error);
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
        }
      );
    }
  };

  return (
    <Container>
      <Header>
        <Title>Support Resources</Title>
      </Header>

      <SearchSection>
        <LocationButton onClick={handleFindMe} disabled={isLocating}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          {isLocating ? 'Finding location...' : 'Find My Location'}
        </LocationButton>
        <SearchInput
          type="text"
          placeholder="Enter ZIP code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>
          Find Local Resources
        </SearchButton>
      </SearchSection>

      {showResults && (
        <Section>
          <SectionTitle>Resources in {getCityName()}</SectionTitle>
          <ResourceGrid>
            {getResourcesForZip().map((resource, index) => (
              <ResourceCard key={index}>
                <ResourceName>{resource.name}</ResourceName>
                <ResourceType>{resource.type}</ResourceType>
                <ResourceDescription>{resource.description}</ResourceDescription>
                <ResourceContact href={`tel:${resource.phone.replace(/\D/g, '')}`}>
                  {resource.phone}
                </ResourceContact>
              </ResourceCard>
            ))}
          </ResourceGrid>
        </Section>
      )}

      <Section>
        <SectionTitle>24/7 Crisis Support</SectionTitle>
        <ResourceGrid>
          {hotlines.map((hotline, index) => (
            <ResourceCard key={index}>
              <ResourceName>{hotline.name}</ResourceName>
              <ResourceDescription>{hotline.description}</ResourceDescription>
              <ResourceContact href={`tel:${hotline.phone.replace(/\D/g, '')}`}>
                {hotline.phone}
              </ResourceContact>
            </ResourceCard>
          ))}
        </ResourceGrid>
      </Section>
    </Container>
  );
};

export default Resources; 